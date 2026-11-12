const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');
const router = express.Router();
const {
    getAdministradores,
    updateAdministrador,
    deleteAdministrador
} = require('../controllers/adminController.js');

/**
 * @swagger
 * tags:
 *   name: Administradores
 *   description: API para gestión del perfil de administradores
 */

/**
 * @swagger
 * /api/administradores:
 *   get:
 *     summary: Obtiene la lista paginada de administradores
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
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
 *         description: Lista paginada de administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAdministradores'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', protegerRutas, getAdministradores);

/**
 * @swagger
 * /api/administradores/{id}:
 *   put:
 *     summary: Actualiza el perfil de un administrador
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del administrador (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAdministradorBody'
 *     responses:
 *       200:
 *         description: Administrador actualizado exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', protegerRutas, requireRole('admin'), updateAdministrador);

/**
 * @swagger
 * /api/administradores/{id}:
 *   delete:
 *     summary: Elimina el perfil de un administrador (solo administradores)
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del administrador (ObjectId)
 *     responses:
 *       200:
 *         description: Administrador eliminado exitosamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', protegerRutas, requireRole('admin'), deleteAdministrador);

module.exports = router;
