const Administrador = require('../models/adminModel');
const mongoose = require('mongoose');
const { fail } = require('../utils/response');


// Obtener todas los Usuarios
const getAdministradores = async (req, res) => {
    try {
        const admin = await Administrador.find().sort({ createdAt: -1 }); 
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un Estudiante por ID
const getAdministradorById = async (req, res) => {
    try {
        const userId = req.user.id;                
        const administrador = await Administrador.findOne({ id_usuario: userId });                            
                
        if (!administrador) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }
        
        res.status(200).json({ admin: administrador });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un Estudiante
const updateAdministrador = async (req, res) => {
    const { id } = req.params;
    const updates = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return fail(res, 400, 'BAD_REQUEST', 'Identificador inválido');
    }

    const forbidden = ['_id', 'id_usuario', 'createdAt', 'updatedAt'];
    const prohibited = forbidden.filter((field) =>
        Object.prototype.hasOwnProperty.call(updates, field)
    );
    if (prohibited.length > 0) {
        return fail(res, 400, 'BAD_REQUEST', `Campos no permitidos: ${prohibited.join(', ')}`);
    }

    try {
        const administrador = await Administrador.findById(id);
        if (!administrador) {
            return fail(res, 404, 'NOT_FOUND', 'Administrador no encontrado');
        }

        const adminActualizado = await Administrador.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.json({
            message: 'Administrador actualizado correctamente',
            admin: adminActualizado
        });
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

// Eliminar un Usuario
const deleteAdministrador = async (req, res) => {
    try {
        const adminEliminado = await Administrador.findByIdAndDelete(req.params.id);
        if (!adminEliminado) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }
        res.status(200).json({ message: 'Administrador eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdministradores,
    getAdministradorById,
    updateAdministrador,
    deleteAdministrador
};