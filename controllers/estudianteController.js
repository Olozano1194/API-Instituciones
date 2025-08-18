const Estudiante = require('../models/estudiantesModel');


// Obtener todas los Usuarios
const getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find()
        .populate('id_usuario', 'email')
        .sort({ createdAt: -1 });
        
        // Formateamos los datos para enviarlos
        const estudiantesFormateados = estudiantes.map(estudiante => ({
            value: estudiante._id,
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            fechanacimiento: estudiante.fechanacimiento,
            direccion: estudiante.direccion,
            telefono: estudiante.telefono,
            // label: estudiante.nombre + ' ' + estudiante.apellido
            //     ? `${estudiante.nombre} ${estudiante.apellido}`
            //     : `Estudiante - ${estudiante.id_usuario?.email} || 'sin email'`,
            email: estudiante.id_usuario?.email,
            // completo: !!(estudiante.nombre && estudiante.apellido)
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
    // console.log('Inicio de actualización');
    const { id } = req.params;
    const updates = req.body;
    // console.log('Id:', id);        
    // console.log('Datos recibidos:', updates);
            
    try {
        const estudiante = await Estudiante.findById(id);
        if (!estudiante) {        
            return res.status(404).json({ message: 'Estudiante no encontrado' });
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
        console.error('❌ Error general updateEstudiante:', error);        
        return res.status(400).json({
        message: 'Error al actualizar estudiante',
        error: error.message
        });
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