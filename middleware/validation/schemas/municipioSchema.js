// Whitelist de campos permitidos al actualizar un municipio.
module.exports = {
  allowed: ['id_municipio', 'descripcion', 'id_departamento'],
  forbidden: ['_id', 'createdAt', 'updatedAt'],
};