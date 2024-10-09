const express = require('express');
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
 *     summary: Obtiene todas las instituciones
 *     tags: [Instituciones]
 *     responses:
 *       200:
 *         description: Lista de todas las instituciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Institucion'
 */
router.get('/', getInstituciones);

/**
 * @swagger
 * /api/instituciones:
 *   post:
 *     summary: Crea una nueva institución
 *     tags: [Instituciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Institucion'
 *     responses:
 *       201:
 *         description: Institución creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Institucion'
 *       400:
 *         description: Error en la creación de la institución
 */
router.post('/', createInstitucion);

/**
 * @swagger
 * /api/instituciones/{id}:
 *   get:
 *     summary: Obtiene una institución por su ID
 *     tags: [Instituciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Institución encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Institucion'
 *       404:
 *         description: Institución no encontrada
 */
router.get('/:id', getInstitucionById);

/**
 * @swagger
 * /api/instituciones/{id}:
 *   put:
 *     summary: Actualiza una institución por su ID
 *     tags: [Instituciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la institución
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Institucion'
 *     responses:
 *       200:
 *         description: Institución actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Institucion'
 *       400:
 *         description: Error en la actualización de la institución
 *       404:
 *         description: Institución no encontrada
 */
router.put('/:id', updateInstitucion);

/**
 * @swagger
 * /api/instituciones/{id}:
 *   delete:
 *     summary: Elimina una institución por su ID
 *     tags: [Instituciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la institución
 *     responses:
 *       200:
 *         description: Institución eliminada exitosamente
 *       404:
 *         description: Institución no encontrada
 */
router.delete('/:id', deleteInstitucion);

module.exports = router;
