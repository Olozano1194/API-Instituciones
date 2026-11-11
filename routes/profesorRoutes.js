const express = require('express');
const protegerRutas = require('../middleware/proteccionRutas/authMiddleware.js');
const requireRole = require('../middleware/proteccionRutas/requireRole.js');
const router = express.Router();
const {
    getProfesores,
    updateProfesor,
    deleteProfesor
} = require('../controllers/profesorController.js');

router.get('/', protegerRutas, getProfesores);
router.put('/:id', protegerRutas, requireRole('admin'), updateProfesor);
router.delete('/:id', protegerRutas, requireRole('admin'), deleteProfesor);

module.exports = router;
