const Departamento = require('../models/departamentoModel');
const { ok, paginated, fail } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const getDepartamentos = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [departamentos, total] = await Promise.all([
            Departamento.find({}, 'id_departamento descripcion').skip(skip).limit(limit),
            Departamento.countDocuments()
        ]);
        paginated(res, departamentos, { page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
    } catch (error) {
        fail(res, 500, 'INTERNAL_ERROR', 'Error al obtener los departamentos');
    }
};

module.exports = { getDepartamentos };
