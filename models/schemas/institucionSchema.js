/**
 * @swagger
 * components:
 *   schemas:
 *     Institucion:
 *       type: object
 *       required:
 *         - nombre
 *         - direccion
 *         - telefono 
 *         - email
 *         - director
 *         - departamento 
 *         - municipio
 *         - nosedes
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre de la institución
 *         direccion:
 *           type: string
 *           description: La dirección de la institución
 *         telefono:
 *           type: string
 *           format: tel
 *           description: El telefono de la institución
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico de la institución 
 *         director:
 *           type: string
 *           description: El nombre del director de la institución
 *         departamento:
 *           type: string
 *           description: El departamento de la institución
 *         municipio:
 *           type: string
 *           description: El municipio de la institución
 *         nosedes:
 *           type: integer
 *           description: El número de sedes de la institución
 *         docentes:
 *           type: integer
 *           description: El número de docentes de la institución
 *         estudiantes:
 *           type: integer
 *           description: El número de estudiantes de la institución       
 *       example:
 *         nombre: "Institución Educativa La Esperanza"
 *         direccion: "Calle 123 #45-67"
 *         telefono: "+57 123 456 7890" 
 *         email: "contacto@institucion.edu.co"
 *         director: "Juan Pérez"
 *         departamento: "Cundinamarca"
 *         municipio: "Bogotá"
 *         nosedes: 3
 *         docentes: 45
 *         estudiantes: 500
 */
