const mongoose = require('mongoose');
const Rol = require('../models/RolModel');

const initRoles = async () => {
    // Esperamos a que la conexión este lista
    if (mongoose.connection.readyState !== 1) {
        // console.log('Esperando a que la conexión esté lista');
        return;        
    }

    try {
        const rolesBase = [
            {
                nombre: 'admin',
                descripcion: 'Administrador del sistema',
                permisos: ['crear', 'leer', 'actualizar', 'eliminar']
            },
            {
                nombre: 'docente',
                descripcion: 'Profesor o docente',
                permisos: ['leer', 'actualizar']
            },
            {
                nombre: 'estudiante',
                descripcion: 'Estudiante',
                permisos: ['leer']
            }
        ];

        for (const rol of rolesBase) {
            try {
                const rolExiste = await Rol.findOne({ nombre: rol.nombre });
                if (!rolExiste) {
                    await Rol.create(rol);
                    // console.log(`Rol ${rol.nombre} creado exitosamente`);
                } else {
                    // console.log(`Rol ${rol.nombre} ya existe`);
                }                
            } catch (error) {
                console.error(`Error al procesar el rol ${rol.nombre}:`, error);                
            }           
        }
        // console.log('Roles base inicializados');
    } catch (error) {
        console.error('Error al inicializar roles:', error);
    }
};

module.exports = initRoles;