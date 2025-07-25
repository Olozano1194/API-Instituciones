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
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // }
    
});

// MIddleware para actualizar la fecha de modificación
// RolModel.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });

const Role = mongoose.model('Rol', RolModel, 'roles');

module.exports = Role;