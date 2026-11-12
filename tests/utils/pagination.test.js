const { parsePagination } = require('../../utils/pagination');

describe('Utils: pagination', () => {
  it('debe retornar valores por defecto cuando no se envían parámetros', () => {
    const result = parsePagination();
    expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
  });

  it('debe retornar valores por defecto cuando el objeto query está vacío', () => {
    const result = parsePagination({});
    expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
  });

  it('debe parsear cadenas numéricas correctamente', () => {
    const result = parsePagination({ page: '3', limit: '10' });
    expect(result).toEqual({ page: 3, limit: 10, skip: 20 });
  });

  it('debe retornar error si page es inválido', () => {
    expect(parsePagination({ page: '0' })).toEqual({ error: 'page debe ser un entero mayor o igual a 1' });
    expect(parsePagination({ page: '-5' })).toEqual({ error: 'page debe ser un entero mayor o igual a 1' });
    expect(parsePagination({ page: 'invalido' })).toEqual({ error: 'page debe ser un entero mayor o igual a 1' });
  });

  it('debe retornar error si limit es inválido', () => {
    expect(parsePagination({ limit: '0' })).toEqual({ error: 'limit debe ser un entero mayor o igual a 1' });
    expect(parsePagination({ limit: '-10' })).toEqual({ error: 'limit debe ser un entero mayor o igual a 1' });
    expect(parsePagination({ limit: 'abc' })).toEqual({ error: 'limit debe ser un entero mayor o igual a 1' });
  });

  it('debe retornar error si limit supera 100', () => {
    expect(parsePagination({ page: '1', limit: '250' })).toEqual({ error: 'limit no puede superar 100' });
  });

  it('debe calcular skip correctamente para combinaciones válidas', () => {
    const result = parsePagination({ page: '4', limit: '25' });
    expect(result.skip).toBe(75);
  });
});