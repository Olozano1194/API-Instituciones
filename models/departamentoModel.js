const mongoose = require('mongoose');

const DepartamentoModel = new mongoose.Schema({
    id_departamento: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Departamento', DepartamentoModel);
