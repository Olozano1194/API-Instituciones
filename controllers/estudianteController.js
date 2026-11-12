const Estudiante = require('../models/estudiantesModel');
const mongoose = require('mongoose');
const { ok, paginated, fail } = require('../utils/response');
const ensureOwnershipOrAdmin = require('../utils/ensureOwnershipOrAdmin');
const { parsePagination } = require('../utils/pagination');

const getEstudiantes = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [estudiantes, total] = await Promise.all([
            Estudiante.find().populate('id_usuario', 'email').sort({ createdAt: -1 }).skip(skip).limit(limit),
            Estudiante.countDocuments()
        ]);
        const estudiantesFormateados = estudiantes.map((estudiante) => ({
            _id: estudiante._id,
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fechanacimiento: estudiante.fechanacimiento,
            direccion: estudiante.direccion,
            telefono: estudiante.telefono,
            email: estudiante.id_usuario?.email
        }));
        paginated(res, estudiantesFormateados, { page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const getEstudianteById = async (req, res) => {
    try {
        const userId = req.user.id;
        const estudiante = await Estudiante.findOne({ id_usuario: userId }).select('nombre apellido fechanacimiento telefono direccion');
        if (!estudiante) {
            return fail(res, 404, 'NOT_FOUND', 'Estudiante no encontrado');
        }
        ok(res, { student: estudiante });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const updateEstudiante = async (req, res) => {
    const { id } = req.params;
    const updates = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return fail(res, 400, 'BAD_REQUEST', 'Identificador inválido');
    }

    const forbidden = ['_id', 'id_usuario', 'createdAt', 'updatedAt'];
    const prohibited = forbidden.filter((field) =>
        Object.prototype.hasOwnProperty.call(updates, field)
    );
    if (prohibited.length > 0) {
        return fail(res, 400, 'BAD_REQUEST', `Campos no permitidos: ${prohibited.join(', ')}`);
    }

    try {
        const estudiante = await Estudiante.findById(id).select('id_usuario');
        if (!estudiante) {
            return fail(res, 404, 'NOT_FOUND', 'Estudiante no encontrado');
        }
        if (!ensureOwnershipOrAdmin(req, res, estudiante.id_usuario)) return;
        const estudianteActualizado = await Estudiante.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        return ok(res, { message: 'Estudiante actualizado correctamente', estudiante: estudianteActualizado });
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

const deleteEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.params.id).select('id_usuario');
        if (!estudiante) {
            return fail(res, 404, 'NOT_FOUND', 'Estudiante no encontrado');
        }
        if (!ensureOwnershipOrAdmin(req, res, estudiante.id_usuario)) return;
        await Estudiante.findByIdAndDelete(req.params.id);
        ok(res, { message: 'Estudiante eliminado' });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const updateEstudianteMe = async (req, res) => {
    const estudiante = await Estudiante.findOne({ id_usuario: req.user.id }).select('_id');
    if (!estudiante) {
        return fail(res, 404, 'NOT_FOUND', 'Estudiante no encontrado');
    }
    req.params = req.params || {};
    req.params.id = estudiante._id.toString();
    return updateEstudiante(req, res);
};

module.exports = {
    getEstudiantes,
    getEstudianteById,
    updateEstudiante,
    updateEstudianteMe,
    deleteEstudiante
};