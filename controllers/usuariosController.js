const Usuario = require('../models/usuarioModel.js');

// Obtener todas los Usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nuevo Usuario
const createUsuario = async (req, res) => {
    const nuevaUsuario = new Usuario(req.body);
    try {
        const usuarioGuardada = await nuevaUsuario.save();
        res.status(201).json(usuarioGuardada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener un Usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(institucion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un Usuario
const updateUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un Usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
};