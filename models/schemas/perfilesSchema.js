/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único del perfil (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0e1"
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Gómez"
 *         fechanacimiento:
 *           type: string
 *           format: date
 *           example: "2006-03-15"
 *         id_usuario:
 *           type: string
 *           description: ID del usuario asociado (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         telefono:
 *           type: string
 *           example: "+57 310 987 6543"
 *         direccion:
 *           type: string
 *           example: "Carrera 45 # 12-34"
 *         email:
 *           type: string
 *           format: email
 *           example: "estudiante@institucion.edu.co"
 *
 *     UpdateEstudianteBody:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Juan Carlos"
 *         apellido:
 *           type: string
 *           example: "Gómez Pérez"
 *         fechanacimiento:
 *           type: string
 *           format: date
 *           example: "2006-03-15"
 *         telefono:
 *           type: string
 *           example: "+57 310 987 6543"
 *         direccion:
 *           type: string
 *           example: "Carrera 45 # 12-34"
 *
 *     PaginatedEstudiantes:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Estudiante'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Profesor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único del perfil docente (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0e2"
 *         nombre:
 *           type: string
 *           example: "María"
 *         apellido:
 *           type: string
 *           example: "Rodríguez"
 *         id_usuario:
 *           type: string
 *           description: ID del usuario asociado (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *         telefono:
 *           type: string
 *           example: "+57 315 222 3344"
 *         especialidad:
 *           type: string
 *           example: "Ciencias Naturales"
 *         email:
 *           type: string
 *           format: email
 *           example: "profesora@institucion.edu.co"
 *
 *     UpdateProfesorBody:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "María Elena"
 *         apellido:
 *           type: string
 *           example: "Rodríguez Torres"
 *         telefono:
 *           type: string
 *           example: "+57 315 222 3344"
 *         especialidad:
 *           type: string
 *           example: "Física y Química"
 *
 *     PaginatedProfesores:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Profesor'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Administrador:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único del perfil administrativo (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0e3"
 *         nombre:
 *           type: string
 *           example: "Laura"
 *         apellido:
 *           type: string
 *           example: "Martínez"
 *         id_usuario:
 *           type: string
 *           description: ID del usuario asociado (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *         telefono:
 *           type: string
 *           example: "+57 320 555 6677"
 *         cargo:
 *           type: string
 *           example: "Secretaria Académica"
 *
 *     UpdateAdministradorBody:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Laura Patricia"
 *         apellido:
 *           type: string
 *           example: "Martínez Silva"
 *         telefono:
 *           type: string
 *           example: "+57 320 555 6677"
 *         cargo:
 *           type: string
 *           example: "Coordinadora de Convivencia"
 *
 *     PaginatedAdministradores:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Administrador'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Admin:
 *       allOf:
 *         - $ref: '#/components/schemas/Administrador'
 *
 *     PaginatedAdmin:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginatedAdministradores'
 */
