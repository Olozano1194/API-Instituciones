const jwt = require('jsonwebtoken');
const protect = require('../../middleware/proteccionRutas/authMiddleware');

describe('Middleware: authMiddleware (protect)', () => {
  const JWT_SECRET = 'secreto_de_prueba_para_tests';
  let req;
  let res;
  let next;

  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe responder 401 si no existe el header authorization', () => {
    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Acceso denegado, no hay token.'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('debe responder 401 si el header authorization no contiene token (formato incorrecto)', () => {
    req.headers['authorization'] = 'Bearer';
    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Acceso denegado, no hay token.'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('debe responder 401 si el token es inválido o no coincide con la firma', () => {
    req.headers['authorization'] = 'Bearer token_totalmente_invalido';
    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token inválido o expirado.'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('debe responder 401 si el token está expirado', () => {
    const expiredToken = jwt.sign(
      { id: 'usr-123', rol: 'admin' },
      JWT_SECRET,
      { expiresIn: '-1s' }
    );
    req.headers['authorization'] = `Bearer ${expiredToken}`;

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token inválido o expirado.'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('debe poblar req.user y llamar a next() cuando el token es válido', () => {
    const payload = { id: 'usr-999', rol: 'profesor' };
    const validToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    req.headers['authorization'] = `Bearer ${validToken}`;

    protect(req, res, next);

    expect(req.user).toEqual({ id: 'usr-999', rol: 'profesor' });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
