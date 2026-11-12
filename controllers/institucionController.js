const Estudiantes = require('../models/estudiantesModel');
const Profesor = require('../models/profesorModel');
const Institucion = require('../models/institucionModel');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const { ok, created, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const institucionSchema = require('../middleware/validation/schemas/institucionSchema');

// Obtener todas las instituciones
const getInstituciones = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [instituciones, total] = await Promise.all([
            Institucion.find().sort({ createdAt: -1 })
                .populate('iddepartamento', 'descripcion')
                .populate('idmunicipio', 'descripcion')
                .populate('estudiantes', 'nombre apellido')
                .populate('profesores', 'nombre apellido especialidad')
                .skip(skip).limit(limit),
            Institucion.countDocuments()
        ]);
        paginated(res, instituciones, { page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
    } catch (error) {
        logger.error(error, 'Error al obtener instituciones');
        fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

// Crear una nueva institución
const createInstitucion = async (req, res) => {
    try {
        const { estudiantes = [], profesores = [] } = req.body;

        // Validar que los Ids de departamento y municipio sean ObjectId válidos
        if (!mongoose.Types.ObjectId.isValid(req.body.iddepartamento)) {
            return fail(res, 400, 'BAD_REQUEST', 'ID de departamento inválido');
        }
        if (!mongoose.Types.ObjectId.isValid(req.body.idmunicipio)) {
            return fail(res, 400, 'BAD_REQUEST', 'ID de municipio inválido');
        }

        // Validar que los Ids de estudiantes y profesores existan
        if (estudiantes.length > 0) {
            const estudiantesValidados = await Estudiantes.find({ _id: { $in: estudiantes } });
            if (estudiantesValidados.length !== estudiantes.length) {
                return fail(res, 400, 'BAD_REQUEST', 'Algunos estudiantes seleccionados no existen');
            }
        }
        if (profesores.length > 0) {
            const profesoresValidados = await Profesor.find({ _id: { $in: profesores } });
            if (profesoresValidados.length !== profesores.length) {
                return fail(res, 400, 'BAD_REQUEST', 'Algunos profesores seleccionados no existen');
            }
        }

        // Whitelist de campos permitidos (evita mass-assignment)
        const allowed = institucionSchema.allowed || [];
        const data = {};
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                data[key] = req.body[key];
            }
        }
        data.estudiantes = estudiantes;
        data.profesores = profesores;

        const nuevaInstitucion = new Institucion(data);
        const institucionGuardada = await nuevaInstitucion.save();

        await institucionGuardada.populate([
            { path: 'estudiantes', select: 'nombre apellido' },
            { path: 'profesores', select: 'nombre apellido especialidad' },
            { path: 'iddepartamento', select: 'descripcion' },
            { path: 'idmunicipio', select: 'descripcion' }
        ]);
        created(res, institucionGuardada);
    } catch (error) {
        logger.error(error, 'Error al crear institución');
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

// Obtener una institución por ID
const getInstitucionById = async (req, res) => {
    try {
        const institucion = await Institucion.findById(req.params.id)
            .populate('iddepartamento', 'descripcion')
            .populate('idmunicipio', 'descripcion');
        if (!institucion) {
            return fail(res, 404, 'NOT_FOUND', 'Institución no encontrada');
        }
        return ok(res, institucion);
    } catch (error) {
        return fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

// Actualizar una institución
const updateInstitucion = async (req, res) => {
    const { id } = req.params;
    const updates = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return fail(res, 400, 'BAD_REQUEST', 'Identificador inválido');
    }

    const allowed = institucionSchema.allowed || [];
    const unknown = Object.keys(updates).filter((key) => !allowed.includes(key));
    if (unknown.length > 0) {
        return fail(res, 400, 'BAD_REQUEST', `Campos no permitidos: ${unknown.join(', ')}`);
    }

    try {
        const institucionActualizada = await Institucion.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })
            .populate('iddepartamento', 'descripcion')
            .populate('idmunicipio', 'descripcion');
        if (!institucionActualizada) {
            return fail(res, 404, 'NOT_FOUND', 'Institución no encontrada');
        }
        return ok(res, institucionActualizada);
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

// Eliminar una institución
const deleteInstitucion = async (req, res) => {
    try {
        const institucionEliminada = await Institucion.findByIdAndDelete(req.params.id);
        if (!institucionEliminada) {
            return fail(res, 404, 'NOT_FOUND', 'Institución no encontrada');
        }
        return ok(res, { message: 'Institución eliminada' });
    } catch (error) {
        return fail(res, 500, 'INTERNAL_ERROR', error.message);
    }
};

module.exports = {
    getInstituciones,
    createInstitucion,
    getInstitucionById,
    updateInstitucion,
    deleteInstitucion
};
