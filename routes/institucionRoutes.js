const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware');
const requireRole = require('../middleware/proteccionRutas/requireRole');
const router = express.Router();
const {
    getInstituciones,
    createInstitucion,
    getInstitucionById,
    updateInstitucion,
    deleteInstitucion
} = require('../controllers/institucionController');

/**
 * @swagger
 * tags:
 *   name: Instituciones
 *   description: API para gestionar instituciones educativas
 */

/**
 * @swagger
 * /api/instituciones:
 *   get:
 *     summary: Obtiene la lista de instituciones educativas
 *     description: Obtiene la lista de instituciones educativas
 *     tags: [Instituciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de instituciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedInstituciones'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', protegerRutas, getInstituciones);

/**
 * @swagger
 * /api/instituciones:
 *   post:
 *     summary: Crea una nueva institución educativa (solo administradores)
 *     description: Crea una nueva institución educativa (solo administradores)
 *     tags: [Instituciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstitucionBody'
 *     responses:
 *       201:
 *         description: Institución creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstitucionResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', protegerRutas, requireRole('admin'), createInstitucion);

/**
 * @swagger
 * /api/instituciones/{id}:
 *   get:
 *     summary: Obtiene una institución por su ID
 *     description: Obtiene una institución por su ID
 *     tags: [Instituciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la institución (ObjectId)
 *     responses:
 *       200:
 *         description: Institución encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstitucionResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', protegerRutas, getInstitucionById);

/**
 * @swagger
 * /api/instituciones/{id}:
 *   put:
 *     summary: Actualiza una institución por su ID (solo administradores)
 *     description: Actualiza una institución por su ID (solo administradores)
 *     tags: [Instituciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la institución (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInstitucionBody'
 *     responses:
 *       200:
 *         description: Institución actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstitucionResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', protegerRutas, requireRole('admin'), updateInstitucion);

/**
 * @swagger
 * /api/instituciones/{id}:
 *   delete:
 *     summary: Elimina una institución por su ID (solo administradores)
 *     description: Elimina una institución por su ID (solo administradores)
 *     tags: [Instituciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la institución (ObjectId)
 *     responses:
 *       200:
 *         description: Institución eliminada exitosamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', protegerRutas, requireRole('admin'), deleteInstitucion);

module.exports = router;
