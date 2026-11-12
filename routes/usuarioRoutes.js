const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');
const { loginLimiter } = require('../middleware/rateLimiter.js');
const router = express.Router();
const {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    updateUsuarioMe,
    deleteUsuario,
    loginUsuario
} = require('../controllers/usuariosController.js');
const upload = require('../middleware/upload.js');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gestión y autenticación de usuarios
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión de usuario y retorna token JWT
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/login', loginLimiter, loginUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene lista paginada de usuarios
 *     tags: [Usuarios]
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
 *         description: Lista paginada de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsuarios'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', protegerRutas, getUsuarios);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un usuario y su perfil asociado (solo administradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUsuarioBody'
 *     responses:
 *       201:
 *         description: Usuario y perfil creados exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', protegerRutas, requireRole('admin'), createUsuario);

/**
 * @swagger
 * /api/usuarios/me:
 *   get:
 *     summary: Obtiene datos del usuario y perfil autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/me', protegerRutas, getUsuarioById);

/**
 * @swagger
 * /api/usuarios/me:
 *   patch:
 *     summary: Actualiza la foto de perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (jpg/jpeg/png, max 3MB)
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch('/me', protegerRutas, upload.single('fotoPerfil'), updateUsuarioMe);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID (administrador o propio usuario)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del usuario
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', protegerRutas, upload.single('fotoPerfil'), updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID (administrador o propio usuario)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', protegerRutas, deleteUsuario);

module.exports = router;
