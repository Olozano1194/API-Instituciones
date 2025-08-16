const mongoose = require('mongoose');
// const Usuario = require('./usuarioModel');

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

const EstudianteSchema = new mongoose.Schema({
    // idestudiante: mongoose.Schema.Types.ObjectId,
    nombre: String,
    apellido: String,
    fechanacimiento: Date,
    id_usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true
    },   
    telefono: String,
    direccion: String,
    // grupos: [GrupoSchema],
    // asistencias: [AsistenciaSchema],
    // evaluaciones: [EvaluacionSchema],
},    
    { timestamps: true     
});

const Estudiantes = mongoose.model('Estudiante', EstudianteSchema);

module.exports = Estudiantes;

