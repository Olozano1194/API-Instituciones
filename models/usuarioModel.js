const mongoose = require('mongoose');

const UsuarioModel = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    roles: String,
    password: String
});

module.exports = mongoose.model('Usuario', UsuarioModel, 'usuarios');

