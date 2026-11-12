const requireRole = require('../../middleware/proteccionRutas/requireRole');

describe('Middleware: requireRole', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('debe responder 403 si req.user no está definido', () => {
    const middleware = requireRole('admin');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'FORBIDDEN',
        message: 'No tiene permisos para esta acción.'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('debe responder 403 si el rol del usuario no está en la lista de permitidos', () => {
    req.user = { id: 'usr-1', rol: 'estudiante' };
    const middleware = requireRole('admin', 'profesor');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'FORBIDDEN',
        message: 'No tiene permisos para esta acción.'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('debe llamar a next() si el rol del usuario coincide con el rol requerido', () => {
    req.user = { id: 'usr-2', rol: 'admin' };
    const middleware = requireRole('admin');

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('debe permitir el acceso si coincide con alguno de los múltiples roles permitidos', () => {
    req.user = { id: 'usr-3', rol: 'coordinador' };
    const middleware = requireRole('admin', 'coordinador', 'rector');

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
