const Departamento = require('../models/departamentoModel');
const { ok, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getDepartamentos = async (req, res) => {
    try {
        const pagination = parsePagination(req.query);
        if (pagination.error) return fail(res, 400, 'BAD_REQUEST', pagination.error);
        const { page, limit, skip } = pagination;
        const [departamentos, total] = await Promise.all([
            Departamento.find({}, 'id_departamento descripcion').skip(skip).limit(limit),
            Departamento.countDocuments()
        ]);
        paginated(res, departamentos, { page, limit, total });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al obtener los departamentos');
    }
};

module.exports = { getDepartamentos };
