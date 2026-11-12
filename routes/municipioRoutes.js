const express = require('express');
const router = express.Router();
const { getMunicipios, getMunicipalityByDepartament } = require('../controllers/municipioController');

/**
 * @swagger
 * tags:
 *   name: Municipios
 *   description: API para consulta de municipios
 */

/**
 * @swagger
 * /api/municipios:
 *   get:
 *     summary: Obtiene lista paginada de todos los municipios
 *     tags: [Municipios]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de elementos por página
 *     responses:
 *       200:
 *         description: Lista paginada de municipios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMunicipios'
 */
router.get('/', getMunicipios);

/**
 * @swagger
 * /api/municipios/by-departamento:
 *   get:
 *     summary: Obtiene los municipios asociados a un departamento
 *     tags: [Municipios]
 *     parameters:
 *       - in: query
 *         name: departamento
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del departamento (ObjectId)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de elementos por página
 *     responses:
 *       200:
 *         description: Lista paginada de municipios del departamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMunicipios'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get('/by-departamento', getMunicipalityByDepartament);

module.exports = router;
