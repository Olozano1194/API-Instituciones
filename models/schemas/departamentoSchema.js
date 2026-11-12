/**
 * @swagger
 * components:
 *   schemas:
 *     Departamentos:
 *       type: object
 *       required:
 *         - id_departamento
 *         - descripcion
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único en base de datos (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *         id_departamento:
 *           type: string
 *           description: Código identificador oficial del departamento
 *           example: "05"
 *         descripcion:
 *           type: string
 *           description: Nombre del departamento
 *           example: "Antioquia"
 *
 *     PaginatedDepartamentos:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Departamentos'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */