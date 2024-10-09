const Institucion = require('../models/institucionModel');

// Obtener todas las instituciones
const getInstituciones = async (req, res) => {
    try {
        const instituciones = await Institucion.find();
        res.status(200).json(instituciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva institución
const createInstitucion = async (req, res) => {
    const nuevaInstitucion = new Institucion(req.body);
    try {
        const institucionGuardada = await nuevaInstitucion.save();
        res.status(201).json(institucionGuardada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener una institución por ID
const getInstitucionById = async (req, res) => {
    try {
        const institucion = await Institucion.findById(req.params.id);
        if (!institucion) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.status(200).json(institucion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una institución
const updateInstitucion = async (req, res) => {
    try {
        const institucionActualizada = await Institucion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!institucionActualizada) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.status(200).json(institucionActualizada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una institución
const deleteInstitucion = async (req, res) => {
    try {
        const institucionEliminada = await Institucion.findByIdAndDelete(req.params.id);
        if (!institucionEliminada) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.status(200).json({ message: 'Institución eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInstituciones,
    createInstitucion,
    getInstitucionById,
    updateInstitucion,
    deleteInstitucion
};
