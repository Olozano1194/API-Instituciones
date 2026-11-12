const mongoose = require('mongoose');
const Rol = require('../models/rolModel');
const logger = require('../config/logger');

const initRoles = async () => {
    // Esperamos a que la conexión este lista
    if (mongoose.connection.readyState !== 1) {
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
                }
            } catch (error) {
                logger.error(error, `Error al procesar el rol ${rol.nombre}`);
            }
        }
    } catch (error) {
        logger.error(error, 'Error al inicializar roles');
    }
};

module.exports = initRoles;