const express = require('express');
const router = express.Router();
const { getDepartamentos } = require('../controllers/departamentoController');

/**
 * @swagger
 * /api/departamentos:
 *   get:
 *     summary: Obtiene todos los departamentos
 *     tags: [Departamentos]
 *     responses:
 *       200:
 *         description: Lista de departamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_departamento:
 *                     type: string
 *                     description: Identificador del departamento
 *                   descripcion:
 *                     type: string
 *                     description: Nombre del departamento
 */
router.get('/', getDepartamentos);

module.exports = router;
