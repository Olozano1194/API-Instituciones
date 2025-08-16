const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,    
    id_usuario: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Usuario', 
            required: true
    },
    telefono: String,
    cargo: String,
    },
    { timestamps: true     
  
});

const Administradores = mongoose.model('Admin', AdminSchema, 'administradores');

module.exports = Administradores;