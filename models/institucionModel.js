const mongoose = require('mongoose');
const Estudiante = require('./estudiantesModel');

const AsistenciaSchema = new mongoose.Schema({
    fecha: Date,
    asistio: Boolean,
    idmateria: mongoose.Schema.Types.ObjectId,
    idperiodo: mongoose.Schema.Types.ObjectId,
});

const EvaluacionSchema = new mongoose.Schema({
    idmateria: mongoose.Schema.Types.ObjectId,
    idperiodo: mongoose.Schema.Types.ObjectId,
    nombre: String,
    descripcion: String,
    fecha: Date,
    nota: {
        valor: Number
    }
});

const GrupoSchema = new mongoose.Schema({
    idgrupo: mongoose.Schema.Types.ObjectId,
    nombre: String,
    descripcion: String,
    materias: [
        {
            idmateria: mongoose.Schema.Types.ObjectId,
            nombre: String,
            descripcion: String,
        }
    ],
    talleres: [
        {
            idtaller: mongoose.Schema.Types.ObjectId,
            nombre: String,
            descripcion: String,
            fechainicio: Date,
            fechafin: Date,
        }
    ]
});

const EstudianteSchema = new mongoose.Schema({
    idestudiante: mongoose.Schema.Types.ObjectId,
    nombre: String,
    apellido: String,
    fechanacimiento: Date,
    email: String,
    telefono: String,
    direccion: String,
    grupos: [GrupoSchema],
    asistencias: [AsistenciaSchema],
    evaluaciones: [EvaluacionSchema],
});

const ProfesorSchema = new mongoose.Schema({
    idprofesor: mongoose.Schema.Types.ObjectId,
    nombre: String,
    apellido: String,
    email: String,
    telefono: String,
    especialidad: String,
});

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


