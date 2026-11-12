/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único del rol (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0a2"
 *         nombre:
 *           type: string
 *           description: Nombre único del rol
 *           example: "admin"
 *         descripcion:
 *           type: string
 *           description: Descripción de las responsabilidades del rol
 *           example: "Administrador del sistema escolar"
 *         permisos:
 *           type: array
 *           items:
 *             type: string
 *             enum: [crear, leer, actualizar, eliminar]
 *           example: ["crear", "leer", "actualizar", "eliminar"]
 *         activo:
 *           type: boolean
 *           default: true
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateRolBody:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: "coordinador"
 *         descripcion:
 *           type: string
 *           example: "Coordinación académica de sede"
 *         permisos:
 *           type: array
 *           items:
 *             type: string
 *             enum: [crear, leer, actualizar, eliminar]
 *           example: ["crear", "leer", "actualizar"]
 *
 *     UpdateRolBody:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "coordinador"
 *         descripcion:
 *           type: string
 *         permisos:
 *           type: array
 *           items:
 *             type: string
 *             enum: [crear, leer, actualizar, eliminar]
 *         activo:
 *           type: boolean
 */
