const express = require('express');
const router = express.Router();
const {
    getRoles,
    getRolById,
    createRol,
    updateRol,
    deleteRol
} = require('../controllers/rolController');
const protegerRutas = require('../routes/proteccionRutas/authMiddleware.js');


// Rutas publicas
router.get('/', getRoles);

// Rutas protegidas
router.get('/:id', getRolById);
router.post('/', protegerRutas, createRol);
router.put('/:id', protegerRutas, updateRol);
router.delete('/:id', protegerRutas, deleteRol);

module.exports = router;