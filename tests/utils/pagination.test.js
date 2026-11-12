const { parsePagination } = require('../../utils/pagination');

describe('Utils: pagination', () => {
  it('debe retornar valores por defecto cuando no se envían parámetros', () => {
    const result = parsePagination();

    expect(result).toEqual({
      page: 1,
      limit: 20,
      skip: 0
    });
  });

  it('debe retornar valores por defecto cuando el objeto query está vacío', () => {
    const result = parsePagination({});

    expect(result).toEqual({
      page: 1,
      limit: 20,
      skip: 0
    });
  });

  it('debe parsear cadenas numéricas correctamente', () => {
    const result = parsePagination({ page: '3', limit: '10' });

    expect(result).toEqual({
      page: 3,
      limit: 10,
      skip: 20
    });
  });

  it('debe normalizar page a 1 si recibe un valor menor a 1 o NaN', () => {
    expect(parsePagination({ page: '0' }).page).toBe(1);
    expect(parsePagination({ page: '-5' }).page).toBe(1);
    expect(parsePagination({ page: 'invalido' }).page).toBe(1);
  });

  it('debe normalizar limit a 20 si recibe un valor menor a 1 o NaN', () => {
    expect(parsePagination({ limit: '0' }).limit).toBe(20);
    expect(parsePagination({ limit: '-10' }).limit).toBe(20);
    expect(parsePagination({ limit: 'abc' }).limit).toBe(20);
  });

  it('debe limitar limit a un máximo de 100', () => {
    const result = parsePagination({ page: '1', limit: '250' });

    expect(result.limit).toBe(100);
  });

  it('debe calcular skip correctamente para combinaciones válidas', () => {
    const result = parsePagination({ page: '4', limit: '25' });

    expect(result.skip).toBe(75);
  });
});
