const express = require('express');
const router = express.Router();
const { getDepartamentos } = require('../controllers/departamentoController');

/**
 * @swagger
 * tags:
 *   name: Departamentos
 *   description: API para consulta de departamentos
 */

/**
 * @swagger
 * /api/departamentos:
 *   get:
 *     summary: Obtiene lista paginada de todos los departamentos
 *     description: Obtiene lista paginada de todos los departamentos
 *     tags: [Departamentos]
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
 *         description: Lista paginada de departamentos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedDepartamentos'
 *       500:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get('/', getDepartamentos);

module.exports = router;
