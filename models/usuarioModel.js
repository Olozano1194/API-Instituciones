const mongoose = require('mongoose');

const UsuarioModel = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, select: false },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol',
    required: true
  },
  fotoPerfil: { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
  idinstitucion: { type: mongoose.Schema.Types.ObjectId, ref: 'Institucion', default: null }
}, {
  timestamps: true
});

const usuario = mongoose.model('Usuario', UsuarioModel, 'usuarios');

module.exports = usuario;