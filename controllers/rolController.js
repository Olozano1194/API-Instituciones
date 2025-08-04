const Rol = require('../models/rolModel');

//Obtener todos los roles
const getRoles = async (req, res) => {
    try {
        const roles = await Rol.find({ activo: true });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener roles',
            error: error.message });
    }
};

//Obtener un rol por ID
const getRolById = async (req, res) => {
    try {
        const rol = await Rol.findById(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener rol',
            error: error.message
        });
    };
};
// Crear un rol
const createRol = async (req, res) => {
    try {
        //Verificamos si el rol existe
        const rolExiste = await Rol.findOne({ nombre: req.body.nombre.tolowerCase() });
        if (rolExiste) {
            return res.status(400).json({ message: "Este rol ya existe" });
        };

        const nuevoRol = new Rol({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            permisos: req.body.permisos
        });

        const rolGuardado = await nuevoRol.save();
        res.status(201).json(rolGuardado);
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear rol',
            error: error.message
        });
    };
};
// Actualizar un rol
const updateRol = async (req, res) => {
    try {
        const rolActualizado = await Rol.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedAt: Date.now()
            },
            { new: true }
        );
        if (!rolActualizado) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        };
        res.status(200).json(rolActualizado);
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar rol',
            error: error.message
        });
    };
};
// Eliminar un rol
const deleteRol = async (req, res) => {
    try {
        const rolEliminado = await Rol.findByIdAndDelete(
            req.params.id,
            { activo: false },
            { new: true }
        );
        if (!rolEliminado) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        };
        res.status(200).json({ message: 'Rol eliminado con éxito' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar rol',
            error: error.message
        });
    };
};

module.exports = {
    createRol,
    getRoles,
    getRolById,
    updateRol,
    deleteRol    
};