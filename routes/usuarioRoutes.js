const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const router = express.Router();
const {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    loginUsuario    
} = require('../controllers/usuariosController.js');
const upload = require('../middleware/upload.js');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gestionar Usuarios de las instituciones educativas
 */
router.post('/login', loginUsuario);
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
router.get('/', protegerRutas,  getUsuarios);

/**
 * @swagger
 * /api/usuario:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/schemas/usuarioSchema'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuarioSchema'
 *       400:
 *         description: Error en la creación del usuario
 */
router.post('/', createUsuario);

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
router.get('/me', protegerRutas, getUsuarioById);

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
router.put('/:id', protegerRutas, upload.single('fotoPerfil'), updateUsuario);

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
router.delete('/:id', protegerRutas, deleteUsuario);


module.exports = router;