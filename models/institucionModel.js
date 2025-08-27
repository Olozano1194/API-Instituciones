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
    iddepartamento: { type: mongoose.Schema.Types.ObjectId, ref: 'Departamento' },
    idmunicipio: { type: mongoose.Schema.Types.ObjectId, ref: 'Municipio' }, 
    // estado: String,
    idsecretaria: mongoose.Schema.Types.ObjectId,
    nosedes: Number,
    estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante' }],
    profesores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' }],
    periodos: [PeriodoSchema] 
}, {
    timestamps: true
});

const Institucion = mongoose.model('Institucion', InstitucionSchema, 'instituciones');

module.exports = Institucion;


