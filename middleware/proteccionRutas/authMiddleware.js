const jwt = require('jsonwebtoken');
const { fail } = require('../../utils/response');

const protect = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return fail(res, 401, 'UNAUTHORIZED', 'Acceso denegado, no hay token.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, rol: decoded.rol };
    return next();
  } catch (err) {
    return fail(res, 401, 'UNAUTHORIZED', 'Token inválido o expirado.');
  }
};
module.exports = protect;