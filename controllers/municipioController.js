const Municipio = require('../models/municipioModel');
const { ok, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getMunicipios = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [municipios, total] = await Promise.all([
            Municipio.find().skip(skip).limit(limit),
            Municipio.countDocuments()
        ]);
        paginated(res, municipios, { page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
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
        const municipios = await Municipio.find({ id_departamento: departamento }).populate('id_departamento');
        if (!municipios || municipios.length === 0) {
            return fail(res, 404, 'NOT_FOUND', 'No se encontraron municipios para el departamento');
        }
        ok(res, municipios);
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al obtener los municipios del departamento');
    }
};

module.exports = { getMunicipios, getMunicipalityByDepartament };
