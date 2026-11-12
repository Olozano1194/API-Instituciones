const Departamento = require('../models/departamentoModel');
const logger = require('../config/logger');

const getDepartamentos = async () => {
    try {
        const response = await fetch('https://api-colombia.com/api/v1/department');

        if (!response.ok) throw new Error('Error al obtener los departamentos');
        const departamentos = await response.json();

        if (!await Departamento.countDocuments()) {
            const mappedDpts = departamentos.map(dept => ({
                id_departamento: String(dept.id),
                descripcion: dept.name
            }));
            await Departamento.insertMany(mappedDpts);
        }
    } catch (error) {
        logger.error(error, 'Error al cargar departamentos');
    }
};

const CargarDatos = async (req, res) => {
    await getDepartamentos();
};
CargarDatos;

module.exports = getDepartamentos;
