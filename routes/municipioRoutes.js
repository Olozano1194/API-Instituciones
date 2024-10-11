const express = require('express');
const router = express.Router();
const { getMunicipios } = require('../controllers/municipioController');

/**
 * @swagger
 * /api/municipios:
 *   get:
 *     summary: Obtiene todos los municipios
 *     tags: [Municipios]
 *     responses:
 *       200:
 *         description: Lista de municipios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_municipio:
 *                     type: string
 *                     description: Identificador del municipio
 *                   descripcion:
 *                     type: string
 *                     description: Nombre del municipio
 *                   id_departamento:
 *                     type: string
 *                     description: Identificador del departamento al que pertenece el municipio
 */
router.get('/municipios', getMunicipios);

module.exports = router;
