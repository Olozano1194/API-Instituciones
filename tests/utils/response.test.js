const { ok, created, paginated, fail, noContent } = require('../../utils/response');

describe('Utils: response', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('ok()', () => {
    it('debe responder 200 por defecto con el envelope data', () => {
      const payload = { id: 1, nombre: 'Test' };
      ok(res, payload);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: payload });
    });

    it('debe permitir un código de estado personalizado', () => {
      const payload = { mensaje: 'Aceptado' };
      ok(res, payload, 202);

      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ data: payload });
    });
  });

  describe('created()', () => {
    it('debe responder 201 con el recurso creado', () => {
      const nuevo = { id: 10, nombre: 'Nuevo recurso' };
      created(res, nuevo);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: nuevo });
    });
  });

  describe('paginated()', () => {
    it('debe responder 200 con data y objeto pagination', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { page: 1, limit: 10, total: 2, totalPages: 1 };
      paginated(res, data, pagination);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data, pagination });
    });
  });

  describe('fail()', () => {
    it('debe responder con el status, código y mensaje dentro del envelope de error', () => {
      fail(res, 404, 'NOT_FOUND', 'Recurso no encontrado');

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          code: 'NOT_FOUND',
          message: 'Recurso no encontrado'
        }
      });
    });
  });

  describe('noContent()', () => {
    it('debe responder 204 sin contenido usando send()', () => {
      noContent(res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
