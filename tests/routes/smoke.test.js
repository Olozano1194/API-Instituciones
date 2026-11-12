const request = require('supertest');
const app = require('../../app');

describe('Smoke & Integration Tests: app', () => {
  describe('Documentación Swagger (/api-docs)', () => {
    it('debe responder con redirección 301 o 200 al acceder a la ruta base de Swagger', async () => {
      const response = await request(app).get('/api-docs');

      expect([200, 301, 302]).toContain(response.status);
    });

    it('debe servir la interfaz HTML de Swagger en /api-docs/', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('Protección de rutas contra accesos no autenticados', () => {
    it('debe rechazar POST /api/roles sin token con 401 y el envelope de error estándar', async () => {
      const response = await request(app)
        .post('/api/roles')
        .send({ nombre: 'rol_prueba' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Acceso denegado, no hay token.'
        }
      });
    });

    it('debe rechazar PUT /api/roles/:id con token malformado respondiendo 401', async () => {
      const response = await request(app)
        .put('/api/roles/64d7fae2b1c8f12345678901')
        .set('Authorization', 'Bearer token_invalido')
        .send({ nombre: 'rol_actualizado' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token inválido o expirado.'
        }
      });
    });
  });
});
