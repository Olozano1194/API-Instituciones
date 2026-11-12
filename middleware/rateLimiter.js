const rateLimit = require('express-rate-limit');
const { fail } = require('../utils/response');

const DEFAULT_MESSAGE = 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.';

/**
 * Crea un middleware de rate limiting con envelope de error estandarizado.
 *
 * @param {Object} options Opciones de configuración de express-rate-limit
 * @returns {Function} Middleware de Express
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = DEFAULT_MESSAGE,
    skip,
    ...rest
  } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      if (process.env.NODE_ENV === 'test' && req.headers['x-bypass-rate-limit'] === 'true') {
        return true;
      }
      return typeof skip === 'function' ? skip(req) : false;
    },
    handler: (req, res) => {
      return fail(res, 429, 'TOO_MANY_REQUESTS', message);
    },
    ...rest
  });
};

// Limiter general para todas las rutas de la API (/api/*)
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 100
});

// Limiter estricto para intentos de autenticación (/api/usuarios/login)
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 5 : 10
});

module.exports = {
  createRateLimiter,
  apiLimiter,
  loginLimiter
};
