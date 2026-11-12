const { fail } = require('../utils/response');
const logger = require('../config/logger');

// Traduce errores de Mongoose a un formato uniforme.
const mapMongooseError = (err) => {
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    return { status: 409, code: 'CONFLICT', message: `El ${field} ya está registrado` };
  }
  if (err && err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return { status: 400, code: 'VALIDATION_ERROR', message: messages.join(', ') || 'Datos inválidos' };
  }
  if (err && err.name === 'CastError') {
    return { status: 400, code: 'BAD_REQUEST', message: 'Identificador inválido' };
  }
  return null;
};

// Middleware global de manejo de errores. Sanitiza el mensaje en producción.
const errorHandler = (err, req, res, next) => {
  logger.error(err);

  // Errores de CORS deben responder 403, no 500.
  const isCorsError = err && /origen no permitido por cors/i.test(err.message || '');
  const mapped = mapMongooseError(err);
  const status = isCorsError ? 403 : (err.status || (mapped ? mapped.status : 500));
  const code = isCorsError ? 'FORBIDDEN' : (err.code || (mapped ? mapped.code : 'INTERNAL_ERROR'));

  const isProd = process.env.NODE_ENV === 'production';
  const message =
    status >= 500 && isProd
      ? 'Error interno del servidor'
      : mapped
      ? mapped.message
      : err.message || 'Error interno del servidor';

  return fail(res, status, code, message);
};
module.exports = errorHandler;
module.exports.mapMongooseError = mapMongooseError;