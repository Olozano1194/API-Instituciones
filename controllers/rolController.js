const Rol = require('../models/rolModel');
const { ok, created, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const ALLOWED_FIELDS = ['nombre', 'descripcion', 'permisos', 'activo'];

const getRoles = async (req, res) => {
    try {
        const pagination = parsePagination(req.query);
        if (pagination.error) return fail(res, 400, 'BAD_REQUEST', pagination.error);
        const { page, limit, skip } = pagination;
        const [roles, total] = await Promise.all([
            Rol.find({ activo: true }).skip(skip).limit(limit),
            Rol.countDocuments({ activo: true })
        ]);
        paginated(res, roles, { page, limit, total });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al obtener roles');
    }
};

const getRolById = async (req, res) => {
    try {
        const rol = await Rol.findById(req.params.id);
        if (!rol) {
            return fail(res, 404, 'NOT_FOUND', 'Rol no encontrado');
        }
        ok(res, rol);
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al obtener rol');
    }
};

const createRol = async (req, res) => {
    try {
        const rolExiste = await Rol.findOne({ nombre: (req.body.nombre || '').toLowerCase() });
        if (rolExiste) {
            return fail(res, 400, 'BAD_REQUEST', 'Este rol ya existe');
        }

        const data = {};
        for (const key of ALLOWED_FIELDS) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                data[key] = req.body[key];
            }
        }
        const nuevoRol = new Rol(data);
        const rolGuardado = await nuevoRol.save();
        created(res, rolGuardado);
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al crear rol');
    }
};

const updateRol = async (req, res) => {
    try {
        const updates = req.body || {};
        const unknown = Object.keys(updates).filter((key) => !ALLOWED_FIELDS.includes(key));
        if (unknown.length > 0) {
            return fail(res, 400, 'BAD_REQUEST', `Campos no permitidos: ${unknown.join(', ')}`);
        }

        const rolActualizado = await Rol.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!rolActualizado) {
            return fail(res, 404, 'NOT_FOUND', 'Rol no encontrado');
        }
        ok(res, rolActualizado);
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al actualizar rol');
    }
};

const deleteRol = async (req, res) => {
    try {
        const rolEliminado = await Rol.findByIdAndDelete(req.params.id);
        if (!rolEliminado) {
            return fail(res, 404, 'NOT_FOUND', 'Rol no encontrado');
        }
        ok(res, null);
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al eliminar rol');
    }
};

module.exports = {
    createRol,
    getRoles,
    getRolById,
    updateRol,
    deleteRol
};