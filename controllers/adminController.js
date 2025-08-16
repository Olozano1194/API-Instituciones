const Administrador = require('../models/adminModel');


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
    // console.log('Inicio de actualización');
    const { id } = req.params;
    const updates = req.body;
    // console.log('Id:', id);        
    // console.log('Datos recibidos:', updates);
            
    try {
        const administrador = await Administrador.findById(id);
        if (!administrador) {        
            return res.status(404).json({ message: 'Administrador no encontrado' });
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
        console.error('❌ Error general updateAdministrador:', error);        
        return res.status(400).json({
        message: 'Error al actualizar administrador',
        error: error.message
        });
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