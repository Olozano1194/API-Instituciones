const Estudiante = require('../models/estudiantesModel');
const mongoose = require('mongoose');
const { fail } = require('../utils/response');


// Obtener todas los Usuarios
const getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find()
        .populate('id_usuario', 'email')
        .sort({ createdAt: -1 });
        
        // Formateamos los datos para enviarlos
        const estudiantesFormateados = estudiantes.map(estudiante => ({
            _id: estudiante._id,
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fechanacimiento: estudiante.fechanacimiento,
            direccion: estudiante.direccion,
            telefono: estudiante.telefono,
            email: estudiante.id_usuario?.email,
        }));
        
        res.status(200).json(estudiantesFormateados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un Estudiante por ID
const getEstudianteById = async (req, res) => {
    try {
        const userId = req.user.id;
        const estudiante = await Estudiante.findOne({ id_usuario: userId });            
                
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        
        res.status(200).json({ student: estudiante });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un Estudiante
const updateEstudiante = async (req, res) => {
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
        const estudiante = await Estudiante.findById(id);
        if (!estudiante) {
            return fail(res, 404, 'NOT_FOUND', 'Estudiante no encontrado');
        }

        const estudianteActualizado = await Estudiante.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.json({
            message: 'Estudiante actualizado correctamente',
            estudiante: estudianteActualizado
        });
    } catch (error) {
        return fail(res, 400, 'BAD_REQUEST', error.message);
    }
};

// Eliminar un Usuario
const deleteEstudiante = async (req, res) => {
    try {
        const estudianteEliminado = await Estudiante.findByIdAndDelete(req.params.id);
        if (!estudianteEliminado) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.status(200).json({ message: 'Estudiante eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEstudiantes,
    getEstudianteById,
    updateEstudiante,
    deleteEstudiante
};