// Parsea parámetros de paginación de forma segura.
// Devuelve { page, limit, skip } o { error } si algún parámetro es inválido.
const parsePagination = (query = {}) => {
  const rawPage = query.page;
  const rawLimit = query.limit;

  let page = 1;
  if (rawPage !== undefined && rawPage !== '') {
    page = parseInt(rawPage, 10);
    if (Number.isNaN(page) || page < 1) {
      return { error: 'page debe ser un entero mayor o igual a 1' };
    }
  }

  let limit = 20;
  if (rawLimit !== undefined && rawLimit !== '') {
    limit = parseInt(rawLimit, 10);
    if (Number.isNaN(limit) || limit < 1) {
      return { error: 'limit debe ser un entero mayor o igual a 1' };
    }
    if (limit > 100) {
      return { error: 'limit no puede superar 100' };
    }
  }

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { parsePagination };