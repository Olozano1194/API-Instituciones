const Usuario = require('../models/usuarioModel');
const Estudiante = require('../models/estudiantesModel');
const Profesor = require('../models/profesorModel');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Rol = require('../models/rolModel');
const mongoose = require('mongoose');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const logger = require('../config/logger');
const enriquecerUsuario = require('../utils/enriquecerUsuario');
const { parsePagination } = require('../utils/pagination');
const { ok, created, paginated, fail } = require('../utils/response');
const ensureOwnershipOrAdmin = require('../utils/ensureOwnershipOrAdmin');
const usuarioSchema = require('../middleware/validation/schemas/usuarioSchema');

const getUsuarios = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [usuarios, total] = await Promise.all([
            Usuario.find().select('email rol').populate('rol', 'nombre').sort({ createdAt: -1 }).skip(skip).limit(limit),
            Usuario.countDocuments()
        ]);
        const usuariosFormateados = await Promise.all(usuarios.map(enriquecerUsuario));
        paginated(res, usuariosFormateados, { page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const createUsuario = async (req, res) => {
    try {
        const { email, password, rol, nombre, apellido } = req.body;
        if (!email || !password) return fail(res, 400, 'BAD_REQUEST', 'Email y contraseña son requeridos');
        if (!rol) return fail(res, 400, 'BAD_REQUEST', 'El rol es requerido');

        let rolId;
        try {
            rolId = new mongoose.Types.ObjectId(rol);
        } catch (error) {
            return fail(res, 400, 'BAD_REQUEST', 'Formato de ID del rol no válido');
        }

        const rolExistente = await Rol.findById(rolId);
        if (!rolExistente) return fail(res, 400, 'BAD_REQUEST', 'El rol especificado no existe');

        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) return fail(res, 400, 'CONFLICT', 'El email ya está registrado');

        // Institución proviene del admin autenticado, no del body.
        const adminUsuario = await Usuario.findById(req.user.id).select('idinstitucion');
        const idinstitucion = adminUsuario?.idinstitucion || null;

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({ email, password: hashedPass, rol: rolId, idinstitucion });
        const usuarioGuardado = await nuevoUsuario.save();

        const rolNombre = rolExistente.nombre.toLowerCase();
        const perfilData = { nombre: nombre || '', apellido: apellido || '' };
        try {
            if (rolNombre === 'estudiante') {
                await Estudiante.create({
                    id_usuario: usuarioGuardado._id,
                    ...perfilData,
                    fechanacimiento: req.body.fechanacimiento || new Date(),
                    telefono: req.body.telefono || '',
                    direccion: req.body.direccion || ''
                });
            } else if (rolNombre === 'docente') {
                await Profesor.create({
                    id_usuario: usuarioGuardado._id,
                    ...perfilData,
                    telefono: req.body.telefono || '',
                    especialidad: req.body.especialidad || ''
                });
            } else if (rolNombre === 'admin') {
                await Admin.create({
                    id_usuario: usuarioGuardado._id,
                    ...perfilData,
                    telefono: req.body.telefono || '',
                    cargo: req.body.cargo || ''
                });
            }
        } catch (profileError) {
            await Usuario.findByIdAndDelete(usuarioGuardado._id);
            return fail(res, 500, 'INTERNAL_ERROR', 'Error al crear el perfil del usuario');
        }

        created(res, {
            usuario: {
                id: usuarioGuardado._id,
                email: usuarioGuardado.email,
                rol: rolExistente.nombre,
                idinstitucion
            }
        });
    } catch (error) {
        if (error.code === 11000) return fail(res, 400, 'CONFLICT', 'El email ya está registrado');
        fail(res, 500, 'INTERNAL_ERROR', 'Error al crear el usuario');
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const userId = req.user.id;
        const usuario = await Usuario.findById(userId).populate('rol', 'nombre');
        if (!usuario) return fail(res, 404, 'NOT_FOUND', 'Usuario no encontrado');

        const rolNombre = (usuario.rol?.nombre || '').toLowerCase();
        let profile = null;
        if (rolNombre.includes('estud')) {
            profile = await Estudiante.findOne({ id_usuario: userId }).select('nombre apellido fechanacimiento telefono direccion');
        } else if (rolNombre.includes('docente') || rolNombre.includes('profesor')) {
            profile = await Profesor.findOne({ id_usuario: userId }).select('nombre apellido telefono especialidad');
        } else if (rolNombre.includes('admin')) {
            profile = await Admin.findOne({ id_usuario: userId }).select('nombre apellido telefono cargo');
        }
        ok(res, {
            user: { id: usuario._id, email: usuario.email, rol: usuario.rol, fotoPerfil: usuario.fotoPerfil },
            profile
        });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const updates = req.body || {};
    const file = req.file;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        if (file) { try { await fsp.unlink(file.path); } catch (_) { } }
        return fail(res, 400, 'BAD_REQUEST', 'Identificador inválido');
    }

    const prohibited = (usuarioSchema.forbidden || []).filter((field) =>
        Object.prototype.hasOwnProperty.call(updates, field)
    );
    if (prohibited.length > 0) {
        if (file) { try { await fsp.unlink(file.path); } catch (_) { } }
        return fail(res, 400, 'BAD_REQUEST', `Campos no permitidos: ${prohibited.join(', ')}`);
    }

    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            if (file) { try { await fsp.unlink(file.path); } catch (_) { } }
            return fail(res, 404, 'NOT_FOUND', 'Usuario no encontrado');
        }

        if (!ensureOwnershipOrAdmin(req, res, usuario._id)) {
            if (file) { try { await fsp.unlink(file.path); } catch (_) { } }
            return;
        }

        if (file) {
            const oldPublicId = usuario.fotoPerfil?.publicId;
            if (oldPublicId) {
                const oldPath = path.join(__dirname, '..', 'uploads', oldPublicId);
                try {
                    await fsp.unlink(oldPath);
                } catch (err) {
                    if (err.code !== 'ENOENT') logger.error(err, 'Error eliminando foto anterior');
                }
            }
            updates.fotoPerfil = { url: `/uploads/${file.filename}`, publicId: file.filename };
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return ok(res, { message: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
    } catch (error) {
        logger.error(error, 'Error general updateUsuario');
        if (file) { try { await fsp.unlink(file.path); } catch (_) { } }
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('_id');
        if (!usuario) return fail(res, 404, 'NOT_FOUND', 'Usuario no encontrado');
        if (!ensureOwnershipOrAdmin(req, res, usuario._id)) return;
        await Usuario.findByIdAndDelete(req.params.id);
        ok(res, { message: 'Usuario eliminado' });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email }).select('+password').populate('rol', 'nombre');
        if (!usuario) return fail(res, 404, 'UNAUTHORIZED', 'Credenciales inválidas');
        const isValidPassword = await bcrypt.compare(password, usuario.password);
        if (!isValidPassword) return fail(res, 400, 'UNAUTHORIZED', 'Credenciales inválidas');
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol?.nombre },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        ok(res, { message: 'Inicio de sesión exitoso', token, user: { rol: usuario.rol?.nombre } });
    } catch (err) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error en el servidor');
    }
};

const updateUsuarioMe = async (req, res) => {
    req.params = req.params || {};
    req.params.id = req.user.id;
    return updateUsuario(req, res);
};

module.exports = { getUsuarios, createUsuario, getUsuarioById, updateUsuario, updateUsuarioMe, deleteUsuario, loginUsuario };
