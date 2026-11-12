const mongoose = require('mongoose');
const Municipio = require('../models/municipioModel');
const { ok, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getMunicipios = async (req, res) => {
    try {
        const pagination = parsePagination(req.query);
        if (pagination.error) return fail(res, 400, 'BAD_REQUEST', pagination.error);
        const { page, limit, skip } = pagination;
        const [municipios, total] = await Promise.all([
            Municipio.find().populate('id_departamento', 'descripcion').skip(skip).limit(limit),
            Municipio.countDocuments()
        ]);
        paginated(res, municipios, { page, limit, total });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al obtener los municipios');
    }
};

const getMunicipalityByDepartament = async (req, res) => {
    try {
        const { departamento } = req.query;
        if (!departamento) {
            return fail(res, 400, 'BAD_REQUEST', 'Falta el parámetro departamento');
        }
        if (!mongoose.Types.ObjectId.isValid(departamento)) {
            return fail(res, 400, 'BAD_REQUEST', 'ID de departamento inválido');
        }
        const pagination = parsePagination(req.query);
        if (pagination.error) return fail(res, 400, 'BAD_REQUEST', pagination.error);
        const { page, limit, skip } = pagination;
        const filter = { id_departamento: departamento };
        const [municipios, total] = await Promise.all([
            Municipio.find(filter).populate('id_departamento', 'descripcion').skip(skip).limit(limit),
            Municipio.countDocuments(filter)
        ]);
        paginated(res, municipios, { page, limit, total });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al obtener los municipios del departamento');
    }
};

module.exports = { getMunicipios, getMunicipalityByDepartament };