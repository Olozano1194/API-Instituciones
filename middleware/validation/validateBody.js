const { fail } = require('../../utils/response');

// Valida el body contra un schema simple con campos `forbidden` y/o `allowed`.
const validateBody = (schema = {}) => (req, res, next) => {
  const body = req.body || {};
  const forbidden = schema.forbidden || [];
  const prohibitedFound = forbidden.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field)
  );

  if (prohibitedFound.length > 0) {
    return fail(
      res,
      400,
      'BAD_REQUEST',
      `Campos no permitidos: ${prohibitedFound.join(', ')}`
    );
  }

  if (Array.isArray(schema.allowed)) {
    const unknown = Object.keys(body).filter(
      (key) => !schema.allowed.includes(key)
    );
    if (unknown.length > 0) {
      return fail(
        res,
        400,
        'BAD_REQUEST',
        `Campos no permitidos: ${unknown.join(', ')}`
      );
    }
  }

  return next();
};

module.exports = validateBody;