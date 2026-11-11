const express = require('express');
const router = express.Router();
const {
    getRoles,
    getRolById,
    createRol,
    updateRol,
    deleteRol
} = require('../controllers/rolController');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');

// Rutas publicas
router.get('/', getRoles);

// Rutas protegidas
router.get('/:id', getRolById);
router.post('/', protegerRutas, requireRole('admin'), createRol);
router.put('/:id', protegerRutas, requireRole('admin'), updateRol);
router.delete('/:id', protegerRutas, requireRole('admin'), deleteRol);

module.exports = router;