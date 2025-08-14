const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const router = express.Router();
const {
    getProfesores,
    getProfesorById,
    updateProfesor,
    deleteProfesor      
} = require('../controllers/profesorController.js');


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gestionar Usuarios de las instituciones educativas
 */
/**
 * @swagger
 * /api/usuario:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/usuariosSchema'
 */
router.get('/', protegerRutas,  getProfesores);

/**
 * @swagger
 * /api/usuario/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuarioSchema'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me-teacher', protegerRutas, getProfesorById);

/**
 * @swagger
 * /api/usuario/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/usuarioSchema'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuarioSchema'
 *       400:
 *         description: Error en la actualización del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', protegerRutas, updateProfesor);

/**
 * @swagger
 * /api/usuario/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [es]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminad exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', protegerRutas, deleteProfesor);


module.exports = router;