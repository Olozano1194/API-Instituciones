const Estudiantes = require('../models/estudiantesModel');
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
    try {
        const { estudiantes = [], profesores = [] } = req.body;

        // Validar que los Ids de estudiantes y profesores existentes
        if (estudiantes.length > 0) {
            const estudiantesValidados = await Estudiantes.find({
                _id: { $in: estudiantes }
            });
            if (estudiantesValidados.length !== estudiantes.length) {
                return res.status(400).json({ message: 'Algunos estudiantes seleccionados no existen' });
            }
        }

        if (profesores.length > 0) {
            const profesoresValidados = await Profesor.find({
                _id: { $in: profesores }
            });
            if (profesoresValidados.length !== profesores.length) {
                return res.status(400).json({ message: 'Algunos profesores seleccionados no existen' });
            }
        }
        
        const nuevaInstitucion = new Institucion({
            ...req.body,
            estudiantes,
            profesores
        });
        const institucionGuardada = await nuevaInstitucion.save();

        await institucionGuardada.populate([
            { path: 'estudiantes', select: 'nombre apellido' },
            { path: 'profesores', select: 'nombre apellido especialidad' }
        ]);
        res.status(201).json(institucionGuardada);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la institución', error: error.message });
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
