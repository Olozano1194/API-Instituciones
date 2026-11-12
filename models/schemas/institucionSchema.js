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
 *         - iddepartamento
 *         - idmunicipio
 *         - nosedes
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único de la institución (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0f1"
 *         nombre:
 *           type: string
 *           description: Nombre oficial de la institución educativa
 *           example: "Institución Educativa La Esperanza"
 *         direccion:
 *           type: string
 *           description: Dirección física de la institución
 *           example: "Calle 123 #45-67"
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto institucional
 *           example: "+57 123 456 7890"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico de la institución
 *           example: "contacto@institucion.edu.co"
 *         director:
 *           type: string
 *           description: Nombre del director o rector de la institución
 *           example: "Juan Pérez"
 *         iddepartamento:
 *           type: string
 *           description: Identificador único del departamento (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *         idmunicipio:
 *           type: string
 *           description: Identificador único del municipio (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0e3"
 *         idsecretaria:
 *           type: string
 *           nullable: true
 *           description: Identificador de la secretaría de educación (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0f4"
 *         nosedes:
 *           type: integer
 *           description: Número de sedes asociadas
 *           example: 3
 *         estudiantes:
 *           type: array
 *           description: Lista de IDs de estudiantes matriculados
 *           items:
 *             type: string
 *         profesores:
 *           type: array
 *           description: Lista de IDs de profesores vinculados
 *           items:
 *             type: string
 *         periodos:
 *           type: array
 *           description: Periodos académicos definidos
 *           items:
 *             type: object
 *             properties:
 *               idperiodo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               fechainicio:
 *                 type: string
 *                 format: date
 *               fechafin:
 *                 type: string
 *                 format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateInstitucionBody:
 *       type: object
 *       required:
 *         - nombre
 *         - direccion
 *         - telefono
 *         - email
 *         - director
 *         - iddepartamento
 *         - idmunicipio
 *         - nosedes
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Institución Educativa La Esperanza"
 *         direccion:
 *           type: string
 *           example: "Calle 123 #45-67"
 *         telefono:
 *           type: string
 *           example: "+57 123 456 7890"
 *         email:
 *           type: string
 *           format: email
 *           example: "contacto@institucion.edu.co"
 *         director:
 *           type: string
 *           example: "Juan Pérez"
 *         iddepartamento:
 *           type: string
 *           description: ObjectId de Departamento existente
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *         idmunicipio:
 *           type: string
 *           description: ObjectId de Municipio existente
 *           example: "64f1a2b3c4d5e6f7a8b9c0e3"
 *         nosedes:
 *           type: integer
 *           example: 3
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *         profesores:
 *           type: array
 *           items:
 *             type: string
 *
 *     UpdateInstitucionBody:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *         direccion:
 *           type: string
 *         telefono:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         director:
 *           type: string
 *         iddepartamento:
 *           type: string
 *         idmunicipio:
 *           type: string
 *         nosedes:
 *           type: integer
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *         profesores:
 *           type: array
 *           items:
 *             type: string
 *
 *     InstitucionResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Institucion'
 */