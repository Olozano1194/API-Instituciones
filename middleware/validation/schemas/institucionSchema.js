// Whitelist de campos permitidos al actualizar una institución.
module.exports = {
  allowed: [
    'nombre',
    'direccion',
    'telefono',
    'email',
    'director',
    'iddepartamento',
    'idmunicipio',
    'idsecretaria',
    'nosedes',
    'periodos',
  ],
  forbidden: ['_id', 'createdAt', 'updatedAt', 'estudiantes', 'profesores'],
};