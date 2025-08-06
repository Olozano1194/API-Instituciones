const Municipio = require('../models/municipioModel');

const getMunicipios = async (req, res) => {
    try {
        const municipios = await Municipio.find();
        res.status(200).json(municipios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los municipios', error });
    }
};

// Obtener una municipio por ID
const getMunicipalityByDepartament = async (req, res) => {
    try {
        const { departamento } = req.query;
        
        if (!departamento) {
            return res.status(404).json({ message: 'Falta el parámetro departamento' });
        }

        const municipios = await Municipio.find({ id_departamento: departamento }).populate('id_departamento');

        if (!municipios || municipios.length === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron municipios para el departamento',
                queryUsed: { id_departamento: departamento }
            });
        }

        res.status(200).json(municipios);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los municipios del departamento',
            error: error.message });
    }
};

module.exports = { getMunicipios, getMunicipalityByDepartament };
