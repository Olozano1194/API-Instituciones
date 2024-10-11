/**
 * @swagger
 * components:
 *   schemas:
 *     Municipio:
 *       type: object
 *       required:
 *         - id_municipio
 *         - descripcion
 *         - id_departamento
 *       properties:
 *         id_municipio:
 *           type: string
 *           description: El identificador único del municipio
 *         descripcion:
 *           type: string
 *           description: El nombre o descripción del municipio
 *         id_departamento:
 *           type: string
 *           description: El identificador único del departamento al que pertenece el municipio
 *       example:
 *         id_municipio: "01001"
 *         descripcion: "Medellín"
 *         id_departamento: "01"
 */
