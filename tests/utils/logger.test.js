const EventEmitter = require('events');
const logger = require('../../config/logger');
const requestLogger = require('../../middleware/requestLogger');

describe('Logger y RequestLogger Middleware', () => {
  describe('Configuración de Pino logger', () => {
    it('debe exponer los métodos de logging estándar', () => {
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('debe tener nivel silent en entorno de pruebas', () => {
      expect(logger.level).toBe('silent');
    });
  });

  describe('Middleware requestLogger', () => {
    it('debe invocar next() inmediatamente si logger.level es silent', () => {
      const req = { method: 'GET', url: '/api/instituciones' };
      const res = new EventEmitter();
      const next = jest.fn();

      requestLogger(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('debe registrar la solicitud y la respuesta al finalizar cuando el nivel está activo', () => {
      const originalLevel = logger.level;
      logger.level = 'info';

      const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});
      const req = { method: 'POST', originalUrl: '/api/usuarios' };
      const res = new EventEmitter();
      res.statusCode = 201;
      const next = jest.fn();

      requestLogger(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith(
        { method: 'POST', url: '/api/usuarios' },
        '--> POST /api/usuarios'
      );

      res.emit('finish');

      expect(infoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/usuarios',
          statusCode: 201
        }),
        expect.stringContaining('<-- POST /api/usuarios 201')
      );

      infoSpy.mockRestore();
      logger.level = originalLevel;
    });

    it('debe registrar con warn respuestas con código 4xx', () => {
      const originalLevel = logger.level;
      logger.level = 'info';

      jest.spyOn(logger, 'info').mockImplementation(() => {});
      const warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});

      const req = { method: 'GET', url: '/api/instituciones/999' };
      const res = new EventEmitter();
      res.statusCode = 404;
      const next = jest.fn();

      requestLogger(req, res, next);
      res.emit('finish');

      expect(warnSpy).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404 }),
        expect.stringContaining('404')
      );

      logger.info.mockRestore();
      warnSpy.mockRestore();
      logger.level = originalLevel;
    });

    it('debe registrar con error respuestas con código 5xx', () => {
      const originalLevel = logger.level;
      logger.level = 'info';

      jest.spyOn(logger, 'info').mockImplementation(() => {});
      const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});

      const req = { method: 'GET', url: '/api/error' };
      const res = new EventEmitter();
      res.statusCode = 500;
      const next = jest.fn();

      requestLogger(req, res, next);
      res.emit('finish');

      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 500 }),
        expect.stringContaining('500')
      );

      logger.info.mockRestore();
      errorSpy.mockRestore();
      logger.level = originalLevel;
    });
  });
});
