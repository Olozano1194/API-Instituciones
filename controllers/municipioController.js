const Municipio = require('../models/municipioModel');

const getMunicipios = async (req, res) => {
    try {
        const municipios = await Municipio.find({}, 'id_municipio descripcion id_departamento');
        res.status(200).json(municipios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los municipios', error });
    }
};

module.exports = { getMunicipios };
