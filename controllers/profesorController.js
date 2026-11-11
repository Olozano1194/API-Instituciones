const Profesor = require('../models/profesorModel');
const mongoose = require('mongoose');
const { fail } = require('../utils/response');


// Obtener todas los Usuarios
const getProfesores = async (req, res) => {
    try {
        const profesor = await Profesor.find()
        .populate('id_usuario', 'email')
        .sort({ createdAt: -1 });        
        
        const profesoresFormateados = profesor.map(profesor => ({
            _id: profesor._id,
            nombre: profesor.nombre,
            apellido: profesor.apellido,
            email: profesor.id_usuario?.email,
            telefono: profesor.telefono,
            especialidad: profesor.especialidad,            
        }));
        res.status(200).json(profesoresFormateados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un Estudiante por ID
const getProfesorById = async (req, res) => {
    try {
        const userId = req.user.id;
        const profesor = await Profesor.findOne({ id_usuario: userId });       
                
        if (!profesor) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }        
        res.status(200).json({ teacher: profesor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un Estudiante
const updateProfesor = async (req, res) => {
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
        const profesor = await Profesor.findById(id);
        if (!profesor) {
            return fail(res, 404, 'NOT_FOUND', 'Profesor no encontrado');
        }

        const profesorActualizado = await Profesor.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.json({
            message: 'Profesor actualizado correctamente',
            profesor: profesorActualizado
        });
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

// Eliminar un Usuario
const deleteProfesor = async (req, res) => {
    try {
        const profesorEliminado = await Profesor.findByIdAndDelete(req.params.id);
        if (!profesorEliminado) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.status(200).json({ message: 'Profesor eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfesores,
    getProfesorById,
    updateProfesor,
    deleteProfesor
};