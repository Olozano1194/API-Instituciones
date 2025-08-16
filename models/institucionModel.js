const mongoose = require('mongoose');


const PeriodoSchema = new mongoose.Schema({
    idperiodo: mongoose.Schema.Types.ObjectId,
    nombre: String,
    fechainicio: Date,
    fechafin: Date,
});

const InstitucionSchema = new mongoose.Schema({
    nombre: String,
    direccion: String,
    telefono: String,
    email: String,
    director: String,
    iddepartamento: mongoose.Schema.Types.ObjectId,
    idmunicipio: mongoose.Schema.Types.ObjectId,
    estado: String,
    idsecretaria: mongoose.Schema.Types.ObjectId,
    nosedes: Number,
    estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante' }],
    profesores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' }],
    periodos: [PeriodoSchema],
});

const Institucion = mongoose.model('Institucion', InstitucionSchema, 'instituciones');

module.exports = Institucion;


