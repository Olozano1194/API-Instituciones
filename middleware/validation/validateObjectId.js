const mongoose = require('mongoose');
const { fail } = require('../../utils/response');

// Valida que un parámetro de ruta sea un ObjectId válido.
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return fail(res, 400, 'BAD_REQUEST', 'Identificador inválido');
  }
  return next();
};

module.exports = validateObjectId;