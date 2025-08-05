const mongoose = require('mongoose');
const Departamentos = require('./departamentoModel') 

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
        ref: 'Departamentos',
        required: true
    }
});

module.exports = mongoose.model('Municipio', MunicipioModel);
