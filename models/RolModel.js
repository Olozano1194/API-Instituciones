const mongoose = require('mongoose');

const RolModel = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del rol es requerido'],
        unique: true,
        trim: true,
        lowecase:true
    },
    descripcion: {
        type: String,
        required:false
    },
    permisos: [{
        type: String,
        enum: ['crear', 'leer', 'actualizar', 'eliminar']
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true    
});

const Rol = mongoose.model('Rol', RolModel, 'roles');

module.exports = Rol;