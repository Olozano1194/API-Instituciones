const mongoose = require('mongoose');

const MunicipioModel = new mongoose.Schema({
    id_municipio: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    id_departamento: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Municipio', MunicipioModel);
