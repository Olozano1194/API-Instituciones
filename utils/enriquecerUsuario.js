const Estudiante = require('../models/estudiantesModel');
const Profesor = require('../models/profesorModel');
const Admin = require('../models/adminModel');

// Enriquece un usuario con nombre/apellido buscando en los perfiles asociados.
const enriquecerUsuario = async (usuario) => {
    const [estudiante, profesor, admin] = await Promise.all([
        Estudiante.findOne({ id_usuario: usuario._id }).select('nombre apellido'),
        Profesor.findOne({ id_usuario: usuario._id }).select('nombre apellido'),
        Admin.findOne({ id_usuario: usuario._id }).select('nombre apellido'),
    ]);

    return {
        _id: usuario._id,
        email: usuario.email,
        rol: usuario.rol?.nombre || 'No asignado',
        nombre: estudiante?.nombre || profesor?.nombre || admin?.nombre || '',
        apellido: estudiante?.apellido || profesor?.apellido || admin?.apellido || '',
    };
};
module.exports = enriquecerUsuario;