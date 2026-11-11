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
const enriquecerUsuario = require('../utils/enriquecerUsuario');

// Obtener todos los Usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('email rol').populate('rol', 'nombre').sort({ createdAt: -1 });
        const usuariosFormateados = await Promise.all(usuarios.map(enriquecerUsuario));
        res.status(200).json(usuariosFormateados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo Usuario
const createUsuario = async (req, res) => {
    try {
        const { email, password, rol } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }

        if (!rol) {
            return res.status(400).json({ message: "El rol es requerido" });
        }
        let rolId;
        try {
            rolId = new mongoose.Types.ObjectId(rol);
        } catch (error) {
            return res.status(400).json({ message: "Formato de ID del rol no válido" });
        }

        const rolExistente = await Rol.findById(rolId);
        if (!rolExistente) {
            return res.status(400).json({ message: 'El rol especificado no existe' });
        }

        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ message: "El usuario ya existe", details: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({
            email,
            password: hashedPass,
            rol: rolId,
            idinstitucion: req.body.idinstitucion || null
        });

        const usuarioGuardado = await nuevoUsuario.save();

        const token = jwt.sign({ id: usuarioGuardado._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

        const rolNombre = rolExistente.nombre.toLowerCase();
        if (rolNombre === 'estudiante') {
            await Estudiante.create({
                id_usuario: usuarioGuardado._id,
                nombre: '',
                apellido: '',
                fechanacimiento: req.body.fechanacimiento || new Date(),
                telefono: '',
                direccion: ''
            });
        } else if (rolNombre === 'docente') {
            await Profesor.create({
                id_usuario: usuarioGuardado._id,
                nombre: '',
                apellido: '',
                telefono: '',
                especialidad: ''
            });
        } else if (rolNombre === 'admin') {
            await Admin.create({
                id_usuario: usuarioGuardado._id,
                nombre: '',
                apellido: '',
                telefono: '',
                cargo: ''
            });
        }

        res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: {
                id: usuarioGuardado._id,
                email: usuarioGuardado.email,
                rol: usuarioGuardado.nombre,
            },
            token
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "El email ya está registrado",
                details: error.message
            });
        }
        res.status(500).json({
            message: "Error al crear el usuario",
            details: error.message
        });
    }
};

// Obtener un Usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const userId = req.user.id;
        const usuario = await Usuario.findById(userId).populate('rol', 'nombre');
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({
            user: {
                id: usuario._id,
                email: usuario.email,
                rol: usuario.rol,
                fotoPerfil: usuario.fotoPerfil,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un Usuario
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;

    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            if (file) {
                try { await fsp.unlink(file.path); } catch (_) { }
            }
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (file) {
            const oldPublicId = usuario.fotoPerfil?.publicId;
            if (oldPublicId) {
                const oldPath = path.join(__dirname, '..', 'uploads', oldPublicId);
                try {
                    await fsp.unlink(oldPath);
                } catch (err) {
                    if (err.code !== 'ENOENT') {
                        console.error('Error eliminando anterior:', err);
                    } else {
                        console.log('No existía archivo anterior:', oldPath);
                    }
                }
            }

            updates.fotoPerfil = {
                url: `/uploads/${file.filename}`,
                publicId: file.filename
            };
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.json({
            message: 'Usuario actualizado correctamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error general updateUsuario:', error);
        if (file) {
            try { await fsp.unlink(file.path); } catch (_) { }
        }
        return res.status(400).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Eliminar un Usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email }).populate('rol', 'nombre');
        if (!usuario) {
            return res.status(404).json({ message: 'Credenciales inválidas' });
        }

        const isValidPassword = await bcrypt.compare(password, usuario.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol?.nombre },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: { rol: usuario.rol?.nombre }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error en el servidor',
            error: err.message
        });
    }
};

module.exports = { getUsuarios, createUsuario, getUsuarioById, updateUsuario, deleteUsuario, loginUsuario };