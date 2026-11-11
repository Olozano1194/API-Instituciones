const Profesor = require('../models/profesorModel');
const mongoose = require('mongoose');
const { ok, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getProfesores = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [profesores, total] = await Promise.all([
            Profesor.find().populate('id_usuario', 'email').sort({ createdAt: -1 }).skip(skip).limit(limit),
            Profesor.countDocuments()
        ]);
        const profesoresFormateados = profesores.map((profesor) => ({
            _id: profesor._id,
            nombre: profesor.nombre,
            apellido: profesor.apellido,
            email: profesor.id_usuario?.email,
            telefono: profesor.telefono,
            especialidad: profesor.especialidad
        }));
        paginated(res, profesoresFormateados, { page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const getProfesorById = async (req, res) => {
    try {
        const userId = req.user.id;
        const profesor = await Profesor.findOne({ id_usuario: userId });
        if (!profesor) {
            return fail(res, 404, 'NOT_FOUND', 'Profesor no encontrado');
        }
        ok(res, { teacher: profesor });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const updateProfesor = async (req, res) => {
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
        const profesor = await Profesor.findById(id);
        if (!profesor) {
            return fail(res, 404, 'NOT_FOUND', 'Profesor no encontrado');
        }
        const profesorActualizado = await Profesor.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        return ok(res, { message: 'Profesor actualizado correctamente', profesor: profesorActualizado });
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

const deleteProfesor = async (req, res) => {
    try {
        const profesorEliminado = await Profesor.findByIdAndDelete(req.params.id);
        if (!profesorEliminado) {
            return fail(res, 404, 'NOT_FOUND', 'Profesor no encontrado');
        }
        ok(res, { message: 'Profesor eliminado' });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

module.exports = {
    getProfesores,
    getProfesorById,
    updateProfesor,
    deleteProfesor
};
