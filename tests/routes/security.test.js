const request = require('supertest');
const express = require('express');

// Mockear el controlador de login para evitar conexión a base de datos en tests
jest.mock('../../controllers/usuariosController', () => ({
  ...jest.requireActual('../../controllers/usuariosController'),
  loginUsuario: jest.fn((req, res) => res.status(200).json({ ok: true }))
}));

const app = require('../../app');
const { createRateLimiter, loginLimiter } = require('../../middleware/rateLimiter');

describe('Seguridad HTTP y Rate Limiting', () => {
  describe('Cabeceras de seguridad con Helmet en app', () => {
    it('debe incluir cabeceras de protección básicas configuradas por Helmet', async () => {
      const response = await request(app).get('/api-docs');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-dns-prefetch-control']).toBe('off');
      expect(response.headers['x-download-options']).toBe('noopen');
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('debe mantener accesible Swagger UI en /api-docs/ sin bloqueo por CSP', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('Rate Limiter: loginLimiter en /api/usuarios/login', () => {
    afterAll(() => {
      // Limpiar el contador de IP para no afectar ejecuciones posteriores
      if (typeof loginLimiter.resetKey === 'function') {
        loginLimiter.resetKey('127.0.0.1');
        loginLimiter.resetKey('::ffff:127.0.0.1');
        loginLimiter.resetKey('::1');
      }
    });

    it('debe responder 429 con el envelope estandarizado cuando se excede el límite', async () => {
      // El límite en NODE_ENV=test es 5 intentos
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/usuarios/login')
          .send({ email: 'rate-limit-test@ejemplo.com', password: 'password123' });

        expect(res.status).toBe(200);
      }

      // La 6ta petición debe ser bloqueada por rate limit
      const blockedResponse = await request(app)
        .post('/api/usuarios/login')
        .send({ email: 'rate-limit-test@ejemplo.com', password: 'password123' });

      expect(blockedResponse.status).toBe(429);
      expect(blockedResponse.body).toEqual({
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.'
        }
      });
    });
  });

  describe('Middleware factory: createRateLimiter', () => {
    let testApp;

    beforeEach(() => {
      testApp = express();
      testApp.use(express.json());

      const testLimiter = createRateLimiter({
        windowMs: 60 * 1000,
        max: 2,
        message: 'Límite de prueba alcanzado.'
      });

      testApp.use('/test-limit', testLimiter, (req, res) => {
        res.status(200).json({ ok: true });
      });
    });

    it('debe permitir solicitudes dentro del límite y bloquear las excedentes con 429', async () => {
      const res1 = await request(testApp).get('/test-limit');
      expect(res1.status).toBe(200);

      const res2 = await request(testApp).get('/test-limit');
      expect(res2.status).toBe(200);

      const res3 = await request(testApp).get('/test-limit');
      expect(res3.status).toBe(429);
      expect(res3.body).toEqual({
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Límite de prueba alcanzado.'
        }
      });
    });

    it('debe respetar el bypass cuando se envía el header x-bypass-rate-limit en test', async () => {
      const res1 = await request(testApp).get('/test-limit').set('x-bypass-rate-limit', 'true');
      expect(res1.status).toBe(200);

      const res2 = await request(testApp).get('/test-limit').set('x-bypass-rate-limit', 'true');
      expect(res2.status).toBe(200);

      const res3 = await request(testApp).get('/test-limit').set('x-bypass-rate-limit', 'true');
      expect(res3.status).toBe(200);
    });
  });
});