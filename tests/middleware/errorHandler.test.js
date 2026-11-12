const errorHandler = require('../../middleware/errorHandler');
const { mapMongooseError } = require('../../middleware/errorHandler');

describe('Middleware: errorHandler', () => {
  let req;
  let res;
  let next;
  let consoleSpy;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });

  describe('mapMongooseError helper', () => {
    it('debe mapear error de clave duplicada (code 11000)', () => {
      const err = {
        code: 11000,
        keyValue: { email: 'admin@escuela.cl' }
      };
      const result = mapMongooseError(err);

      expect(result).toEqual({
        status: 409,
        code: 'CONFLICT',
        message: 'El email ya está registrado'
      });
    });

    it('debe mapear ValidationError concatenando mensajes', () => {
      const err = {
        name: 'ValidationError',
        errors: {
          nombre: { message: 'El nombre es obligatorio' },
          edad: { message: 'La edad debe ser mayor a 0' }
        }
      };
      const result = mapMongooseError(err);

      expect(result).toEqual({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'El nombre es obligatorio, La edad debe ser mayor a 0'
      });
    });

    it('debe mapear CastError como BAD_REQUEST', () => {
      const err = { name: 'CastError' };
      const result = mapMongooseError(err);

      expect(result).toEqual({
        status: 400,
        code: 'BAD_REQUEST',
        message: 'Identificador inválido'
      });
    });

    it('debe retornar null para errores no reconocidos de Mongoose', () => {
      const err = new Error('Error normal');
      expect(mapMongooseError(err)).toBeNull();
    });
  });

  describe('middleware errorHandler', () => {
    it('debe manejar CastError devolviendo 400 y BAD_REQUEST', () => {
      const err = { name: 'CastError' };

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          code: 'BAD_REQUEST',
          message: 'Identificador inválido'
        }
      });
    });

    it('debe manejar ValidationError devolviendo 400 y los mensajes correspondientes', () => {
      const err = {
        name: 'ValidationError',
        errors: {
          email: { message: 'Email inválido' }
        }
      };

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email inválido'
        }
      });
    });

    it('debe respetar códigos de estado y mensajes personalizados del error', () => {
      const err = {
        status: 403,
        code: 'FORBIDDEN_OPERATION',
        message: 'Operación no permitida para este recurso'
      };

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          code: 'FORBIDDEN_OPERATION',
          message: 'Operación no permitida para este recurso'
        }
      });
    });

    it('debe devolver 500 e INTERNAL_ERROR ante errores genéricos en entorno no-producción', () => {
      process.env.NODE_ENV = 'development';
      const err = new Error('Fallo crítico en servicio externo');

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fallo crítico en servicio externo'
        }
      });
    });

    it('debe sanitizar mensajes de error 500 cuando está en producción', () => {
      process.env.NODE_ENV = 'production';
      const err = new Error('Detalle sensible de base de datos');

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error interno del servidor'
        }
      });
    });
  });
});
