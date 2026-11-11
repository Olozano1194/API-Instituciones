const { fail } = require('../../utils/response');

// Factory de middleware de autorización por rol.
const requireRole = (...roles) => (req, res, next) => {
  const rol = req.user?.rol;
  if (!rol || !roles.includes(rol)) {
    return fail(res, 403, 'FORBIDDEN', 'No tiene permisos para esta acción.');
  }
  return next();
};
module.exports = requireRole;