const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioModel = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: { type: String, required: true, unique: true },
    rol: String,
    password: { type: String, require: true },
});

const usuario = mongoose.model('Usuario', UsuarioModel, 'usuarios');

module.exports = usuario;
