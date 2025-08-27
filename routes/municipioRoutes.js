const express = require('express');
const router = express.Router();
const { getMunicipios, getMunicipalityByDepartament } = require('../controllers/municipioController');

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
 *                 $ref: '#/components/schemas/Municipios'
 */
router.get('/', getMunicipios);

// 
router.get('/by-departamento', getMunicipalityByDepartament);

module.exports = router;
