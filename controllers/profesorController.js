const Profesor = require('../models/profesorModel');


// Obtener todas los Usuarios
const getProfesores = async (req, res) => {
    try {
        const profesor = await Profesor.find()
        .populate('id_usuario', 'email')
        .sort({ createdAt: -1 });        
        
        const profesoresFormateados = profesor.map(profesor => ({
            value: profesor._id,
            nombre: profesor.nombre,
            apellido: profesor.apellido,
            // label: profesor.nombre + ' ' + profesor.apellido
            //     ? `${profesor.nombre} ${profesor.apellido}`
            //     : `Profesor - ${profesor.id_usuario?.email} || 'sin email'`,
            email: profesor.id_usuario?.email,
            telefono: profesor.telefono,
            especialidad: profesor.especialidad,
            // completo: !!(profesor.nombre && profesor.apellido)
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
    // console.log('Inicio de actualización');
    const { id } = req.params;
    const updates = req.body;
    // console.log('Id:', id);        
    // console.log('Datos recibidos:', updates);
            
    try {
        const profesor = await Profesor.findById(id);
        if (!profesor) {        
            return res.status(404).json({ message: 'Profesor no encontrado' });
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
        console.error('❌ Error general updateProfesor:', error);        
        return res.status(400).json({
        message: 'Error al actualizar profesor',
        error: error.message
        });
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