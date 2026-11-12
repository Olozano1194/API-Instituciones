const { fail } = require('./response');

// Devuelve true si el usuario autenticado es admin/superadmin o es el propietario del recurso.
// Si no puede acceder, responde 404 (anti-enumeración) y devuelve false.
function ensureOwnershipOrAdmin(req, res, ownerId) {
    const rol = req.user?.rol;
    if (rol === 'admin' || rol === 'superadmin') return true;
    if (ownerId && String(ownerId) === String(req.user?.id)) return true;
    fail(res, 404, 'NOT_FOUND', 'Recurso no encontrado');
    return false;
}
module.exports = ensureOwnershipOrAdmin;