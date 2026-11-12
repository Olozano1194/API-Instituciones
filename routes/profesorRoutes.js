const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');
const router = express.Router();
const {
    getProfesores,
    updateProfesor,
    deleteProfesor
} = require('../controllers/profesorController.js');

/**
 * @swagger
 * tags:
 *   name: Profesores
 *   description: API para gestión del perfil de docentes
 */

/**
 * @swagger
 * /api/profesores:
 *   get:
 *     summary: Obtiene la lista paginada de profesores
 *     tags: [Profesores]
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
 *         description: Lista paginada de profesores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProfesores'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', protegerRutas, getProfesores);

/**
 * @swagger
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualiza el perfil de un profesor (administrador o propietario)
 *     tags: [Profesores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del profesor (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfesorBody'
 *     responses:
 *       200:
 *         description: Profesor actualizado exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', protegerRutas, requireRole('admin'), updateProfesor);

/**
 * @swagger
 * /api/profesores/{id}:
 *   delete:
 *     summary: Elimina el perfil de un profesor (administrador o propietario)
 *     tags: [Profesores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del profesor (ObjectId)
 *     responses:
 *       200:
 *         description: Profesor eliminado exitosamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', protegerRutas, requireRole('admin'), deleteProfesor);

module.exports = router;
