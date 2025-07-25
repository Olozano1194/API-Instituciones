const mongoose = require('mongoose');
const Rol = require('./RolModel');

const UsuarioModel = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    rol: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol',
        required: true
    },    
    idinstitucion: { type: Number, default: null }
}, {
    timestamps: true
});

const usuario = mongoose.model('Usuario', UsuarioModel, 'usuarios');

module.exports = usuario;
