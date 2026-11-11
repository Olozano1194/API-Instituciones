const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');
const router = express.Router();
const {
    getAdministradores,
    updateAdministrador,
    deleteAdministrador
} = require('../controllers/adminController.js');

router.get('/', protegerRutas, getAdministradores);
router.put('/:id', protegerRutas, requireRole('admin'), updateAdministrador);
router.delete('/:id', protegerRutas, requireRole('admin'), deleteAdministrador);

module.exports = router;
