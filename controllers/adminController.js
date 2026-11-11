const Administrador = require('../models/adminModel');
const mongoose = require('mongoose');
const { ok, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getAdministradores = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [admins, total] = await Promise.all([
            Administrador.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Administrador.countDocuments()
        ]);
        paginated(res, admins, { page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const getAdministradorById = async (req, res) => {
    try {
        const userId = req.user.id;
        const administrador = await Administrador.findOne({ id_usuario: userId });
        if (!administrador) {
            return fail(res, 404, 'NOT_FOUND', 'Administrador no encontrado');
        }
        ok(res, { admin: administrador });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

const updateAdministrador = async (req, res) => {
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
        const administrador = await Administrador.findById(id);
        if (!administrador) {
            return fail(res, 404, 'NOT_FOUND', 'Administrador no encontrado');
        }
        const adminActualizado = await Administrador.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        return ok(res, { message: 'Administrador actualizado correctamente', admin: adminActualizado });
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

const deleteAdministrador = async (req, res) => {
    try {
        const adminEliminado = await Administrador.findByIdAndDelete(req.params.id);
        if (!adminEliminado) {
            return fail(res, 404, 'NOT_FOUND', 'Administrador no encontrado');
        }
        ok(res, { message: 'Administrador eliminado' });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

module.exports = {
    getAdministradores,
    getAdministradorById,
    updateAdministrador,
    deleteAdministrador
};
