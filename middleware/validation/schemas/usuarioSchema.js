// Campos prohibidos al actualizar un usuario (mass-assignment).
module.exports = {
  forbidden: ['rol', 'password', 'idinstitucion', 'email', '_id', 'createdAt', 'updatedAt'],
};