/**
 * @swagger
 * components:
 *   schemas:
 *     Municipios:
 *       type: object
 *       required:
 *         - id_municipio
 *         - descripcion
 *         - id_departamento
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único en base de datos (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0e3"
 *         id_municipio:
 *           type: string
 *           description: Código oficial del municipio
 *           example: "05001"
 *         descripcion:
 *           type: string
 *           description: Nombre del municipio
 *           example: "Medellín"
 *         id_departamento:
 *           type: string
 *           description: Identificador del departamento al que pertenece (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *
 *     PaginatedMunicipios:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Municipios'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */
