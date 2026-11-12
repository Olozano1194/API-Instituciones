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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Departamento',
        required: true
    }
});

module.exports = mongoose.model('Municipio', MunicipioModel);