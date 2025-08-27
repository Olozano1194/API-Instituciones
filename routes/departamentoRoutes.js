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
 *                 $ref: '#/components/schemas/Departamentos'
 */
router.get('/', getDepartamentos);

module.exports = router;
