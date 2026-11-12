// Whitelist de campos permitidos al actualizar un departamento.
module.exports = {
  allowed: ['id_departamento', 'descripcion'],
  forbidden: ['_id', 'createdAt', 'updatedAt'],
};