const Administrador = require('../models/adminModel');
const mongoose = require('mongoose');
const { ok, paginated, fail } = require('../utils/response');
const ensureOwnershipOrAdmin = require('../utils/ensureOwnershipOrAdmin');
const { parsePagination } = require('../utils/pagination');

const getAdministradores = async (req, res) => {
    try {
        const pagination = parsePagination(req.query);
        if (pagination.error) return fail(res, 400, 'BAD_REQUEST', pagination.error);
        const { page, limit, skip } = pagination;
        const [admins, total] = await Promise.all([
            Administrador.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Administrador.countDocuments()
        ]);
        paginated(res, admins, { page, limit, total });
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
        ok(res, { profile: administrador });
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
        const administrador = await Administrador.findById(id).select('id_usuario');
        if (!administrador) {
            return fail(res, 404, 'NOT_FOUND', 'Administrador no encontrado');
        }
        if (!ensureOwnershipOrAdmin(req, res, administrador.id_usuario)) return;
        const adminActualizado = await Administrador.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        return ok(res, adminActualizado);
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

const deleteAdministrador = async (req, res) => {
    try {
        const administrador = await Administrador.findById(req.params.id).select('id_usuario');
        if (!administrador) {
            return fail(res, 404, 'NOT_FOUND', 'Administrador no encontrado');
        }
        if (!ensureOwnershipOrAdmin(req, res, administrador.id_usuario)) return;
        await Administrador.findByIdAndDelete(req.params.id);
        ok(res, null);
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