// Parsea parámetros de paginación de forma segura.
const parsePagination = (query = {}) => {
  let page = parseInt(query.page, 10);
  if (Number.isNaN(page) || page < 1) page = 1;

  let limit = parseInt(query.limit, 10);
  if (Number.isNaN(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { parsePagination };