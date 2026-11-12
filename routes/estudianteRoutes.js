const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');
const router = express.Router();
const {
    getEstudiantes,
    updateEstudiante,
    deleteEstudiante
} = require('../controllers/estudianteController.js');

/**
 * @swagger
 * tags:
 *   name: Estudiantes
 *   description: API para gestión del perfil de estudiantes
 */

/**
 * @swagger
 * /api/estudiantes:
 *   get:
 *     summary: Obtiene la lista paginada de estudiantes
 *     description: Obtiene la lista paginada de estudiantes
 *     tags: [Estudiantes]
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
 *         description: Lista paginada de estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEstudiantes'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', protegerRutas, getEstudiantes);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   put:
 *     summary: Actualiza el perfil de un estudiante (administrador o propietario)
 *     description: Actualiza el perfil de un estudiante (administrador o propietario)
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del estudiante (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEstudianteBody'
 *     responses:
 *       200:
 *         description: Estudiante actualizado exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', protegerRutas, requireRole('admin'), updateEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   delete:
 *     summary: Elimina el perfil de un estudiante (administrador o propietario)
 *     description: Elimina el perfil de un estudiante (administrador o propietario)
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del estudiante (ObjectId)
 *     responses:
 *       200:
 *         description: Estudiante eliminado exitosamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', protegerRutas, requireRole('admin'), deleteEstudiante);

module.exports = router;
