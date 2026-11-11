const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');
const router = express.Router();
const {
    getEstudiantes,
    updateEstudiante,
    deleteEstudiante
} = require('../controllers/estudianteController.js');

router.get('/', protegerRutas, getEstudiantes);
router.put('/:id', protegerRutas, requireRole('admin'), updateEstudiante);
router.delete('/:id', protegerRutas, requireRole('admin'), deleteEstudiante);

module.exports = router;
