const Departamento = require('../models/departamentoModel');


const getDepartamentos = async () => {
    try {
        const response = await fetch('https://api-colombia.com/api/v1/department');

        if(!response.ok) throw new Error('Error al obtener los departamentos');
        const departamentos = await response.json();

        //Si ya están en la bd no se insertan
        // const existenDepartamentos = await Departamento.find({});
        // if (existenDepartamentos.length === 0) {
        //     await Departamento.insertMany(departamentos);
        //     console.log('Departamentos cargados con exito');            
        // }
        if (!await Departamento.countDocuments()) {
            const mappedDpts = departamentos.map(dept => ({
                id_departamento: String(dept.id),
                descripcion: dept.name
            }));
            await Departamento.insertMany(mappedDpts);
        }
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
    };
};

const CargarDatos = async (req, res) => {
    await getDepartamentos();
};
CargarDatos

module.exports = getDepartamentos 