const mongoose = require('mongoose');
// const Usuario = require('./usuarioModel');

const EstudianteSchema = new mongoose.Schema({
    idestudiante: mongoose.Schema.Types.ObjectId,
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

