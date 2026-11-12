# Propuesta SDD — "mejorar-api-contrato"

> Proyecto: API-Instituciones (Node/Express 4 + Mongoose 8 + JWT + Cloudinary, deploy Vercel).
> Change: `mejorar-api-contrato`. Fase: PROPOSE.
> Artefacto: PRD (Product/Problem Requirements Document) para el primer slice.

---

## 1. Problema

La API actual funciona para desarrollo local pero no está lista para integrarse con el frontend (React) ni para producción:

- **Seguridad rota en producción**: el código verifica JWT con `process.env.SECRET_KEY` mientras `.env.example` define `JWT_SECRET`. En cualquier entorno donde solo exista `JWT_SECRET`, los tokens nunca verifican. CORS está hardcodeado a `http://localhost:5173` y se mezcla `cors()` con headers manuales. El schema de password no es `required`, no tiene `minlength` ni `select:false`. Los controllers devuelven `err.message`/stack al cliente. `updateUsuario` hace `$set` arbitrario desde `req.body` (mass assignment, incluye `password`/`rol`). `authMiddleware` responde 403 en token inválido (debería 401) y no hay autorización por rol.
- **Contrato inconsistente**: rutas singulares/plurales mezcladas (`/api/usuario`, `/api/estudiante`, `/api/profesor`, `/api/admin` vs `/api/instituciones`). Endpoints "me" inconsistentes (`/me`, `/me-student`, `/me-teacher`, `/me-admin`). Respuestas heterogéneas (arrays vs `{student}`, `{teacher}`, `{admin}`, `{user}`, `{usuario}`). Sin paginación. Swagger JSDoc desactualizado (todo referencia `/api/usuario`).
- **Modelo de datos roto**: `municipio.id_departamento` es `String` mientras `departamento._id` e `institucion.iddepartamento` son `ObjectId`; populate cruzado no funciona. `Admin` no se popula en `getAdministradores`. `idinstitucion` en `Usuario` es `Number` pero `Institucion` usa `ObjectId`.
- **Flujo de negocio**: la creación de cuentas de estudiantes/profesores la hace la secretaría (admin) de la institución, no auto-registro. Hoy no hay endpoints de creación de perfiles. Las actualizaciones requieren `:id` en URL (riesgo IDOR). `deleteUsuario` no hace cascade del perfil.

El primer slice se limita a **auth + gestión de entidades y perfiles** (instituciones, municipios, departamentos, secretarías, usuarios por rol). Notas/tareas/clases quedan fuera.

## 2. Objetivos

1. Dejar la API segura para producción (P0) sin romper el flujo de desarrollo.
2. Normalizar el contrato HTTP (P1) antes de que el frontend se integre, para evitar migraciones posteriores.
3. Corregir el FK `municipio.id_departamento` (P2 mínimo) para que populate funcione.
4. Habilitar el flujo front: superadmin crea entidades → admin de institución registra colegio/sedes/alumnos/profesores → login de estudiante/profesor → dashboards (dashboards en slice posterior).
5. Mantener archivos ≤250 líneas, funciones ≤30, junior-friendly, MVC flat, sin agregar dependencias sin justificación.

## 3. Alcance

### En alcance (este change)

**P0 — Seguridad**
- Unificar env JWT: usar `JWT_SECRET` (y `JWT_EXPIRES_IN`) de forma consistente; eliminar `SECRET_KEY`. Actualizar `.env.example` si hace falta.
- CORS por env: `FRONTEND_ORIGIN` (soporte lista separada por coma), credentials coherente, eliminar headers hardcodeados.
- Schema de password: `required`, `minlength` (≥8), `select:false`; bcrypt con salt rounds ≥10.
- Sanitizar errores: en producción no exponer `err.message`/stack; handler centralizado con código de error.
- Mass-assignment guard en `updateUsuario`: lista blanca de campos editables; nunca `password`/`rol`/`idinstitucion` desde el body.
- Corregir tipo `idinstitucion` en `Usuario` a `ObjectId` ref `Institucion`.
- `authMiddleware`: 401 para token inválido/expirado; agregar middleware de autorización por rol (`requireRole`).
- Rate limiting básico en `/api/auth` (login/register) — sin deps nuevas si es posible (middleware in-memory o `express-rate-limit` justificado).

**P1 — Contrato**
- Estandarizar rutas en plural: `/api/usuarios`, `/api/estudiantes`, `/api/profesores`, `/api/administradores` (mantener `/api/instituciones`, `/api/departamentos`, `/api/municipios`, `/api/roles`).
- Estandarizar "me": `GET/PATCH /api/<recurso>/me` usando `req.user.id` (sin `:id` en URL para el propio perfil).
- Envelope de respuesta consistente: `{ data, meta }` para listas (con `page`, `limit`, `total`) y `{ data }` para single. Errores: `{ error: { code, message } }`.
- Paginación `page`/`limit` en endpoints de listado (default razonable, max 100).
- Swagger JSDoc actualizado a las rutas reales, tags correctos.

**P2 mínimo — Modelo**
- Cambiar `municipio.id_departamento` a `ObjectId` ref `Departamento`.
- Popular `id_usuario` en `getAdministradores`.
- (Opcional en este slice) transacción/atención de orphans en creación user+perfil; si no, documentar.

**Entidades/perfiles en alcance**
- Departamentos, municipios, instituciones, roles, usuarios (por rol), administradores (secretaría), estudiantes, profesores — lectura + actualización de perfil propio + creación de perfil por admin de institución (lo mínimo para el flujo).

### Fuera de alcance (este change)

- Notas, tareas, clases (slice posterior).
- P3 completo: CRUD completo de estudiantes/profesores/administradores más allá de creación por secretaría; cascade delete; dashboards.
- P4 refactor profundo: eliminación de console, setTimeout init, reestructura de carpetas, TypeScript.
- Migración de datos existentes (se documenta; ejecución manual si aplica).
- Tests automatizados (infraestructura pendiente; se deja hook para agregar, no bloquea).

## 4. Criterios de éxito (medibles)

- [ ] `npm start` arranca con `JWT_SECRET` definido y un token emitido por `/api/auth/login` (o equivalente) verifica correctamente en `protect`.
- [ ] Con `NODE_ENV=production`, una request con token inválido devuelve 401 `{ error: { code: "UNAUTHORIZED" } }` sin stack trace.
- [ ] CORS permite origen configurado en `FRONTEND_ORIGIN` y rechaza origen no listado (verificable con curl/Postman).
- [ ] `updateUsuario` con body `{ rol, password, idinstitucion }` ignora esos campos (no persisten) — test manual con mongosh.
- [ ] Todas las rutas de listado responden `{ data: [...], meta: { page, limit, total } }`.
- [ ] `GET /api/municipios/:id` con populate de departamento devuelve el departamento completo (no null).
- [ ] Swagger UI en `/api-docs` lista las rutas reales sin 404 al "Try it out" para al menos auth + usuarios + instituciones.
- [ ] Ningún archivo supera 250 líneas; funciones ≤30 líneas (revisión manual).
- [ ] No se agregaron dependencias sin justificación en el PR (o se justificó rate-limit).

## 5. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Romper callers existentes al cambiar rutas | Medio | No hay frontend integrado aún; documentar en PR; mantener aliases temporales solo si es barato (decidir en spec). |
| Migración de `municipio.id_departamento` String→ObjectId | Alto (datos existentes) | Script de migración documentado; en dev, re-seed vía initMunicipio. No bloquear arranque si falla cast. |
| Envelope rompe consumidores futuros | Bajo (pre-integración) | Hacerlo ahora, antes del front; documentar en Swagger. |
| Mass-assignment en otros controllers | Medio | Aplicar lista blanca también a institucion/municipio/departamento updates. |
| Rate limit in-memory no escala en Vercel serverless | Bajo | Aceptar para MVP; documentar; mover a Upstash/Redis si crece. |
| IDOR en updates por `:id` | Alto | Scope a `req.user.id` en `/me`; guards de rol para operaciones sobre terceros. |
| Orphan user si falla creación de perfil | Medio | Ordenar: crear perfil primero o limpiar en catch; documentar. |

## 6. Plan por fases (work units)

Respetar límite de 400 líneas por PR/review. Cada work unit = un commit/PR revisable.

**WU0 — Baseline y seguridad mínima (P0 core)** (~150 líneas)
- Fix env JWT (`JWT_SECRET`), authMiddleware 401, password schema, bcrypt rounds.
- CORS por env.
- Error handler sanitizado.

**WU1 — Mass-assignment + tipos + roles** (~120 líneas)
- Lista blanca en updates (usuario, institucion, municipio, departamento).
- `idinstitucion` ObjectId en Usuario.
- Middleware `requireRole`.

**WU2 — Contrato de rutas y envelope** (~200 líneas)
- Pluralizar rutas; endpoints `/me`.
- Envelope `{ data, meta }` + paginación en listados.
- Actualizar Swagger JSDoc.

**WU3 — Modelo municipio FK + populate** (~80 líneas)
- `municipio.id_departamento` → ObjectId ref.
- Populate en controllers afectados.
- Migración/re-seed documentada.

**WU4 — Creación de perfiles por secretaría (mínimo)** (~180 líneas)
- `POST /api/estudiantes`, `/api/profesores`, `/api/administradores` scoped a institución del admin autenticado.
- Validación de referencias (ObjectId existentes).

**WU5 — Limpieza y docs** (~100 líneas)
- Eliminar console.log comentados, setTimeout init → await secuencial, README/variables.
- Swagger completo.

Cada WU se valida con smoke test manual (curl/Postman) antes del siguiente. No se avanza sin visto bueno del usuario (ask-on-risk).

## 7. Dependencias y supuestos

- No se agregan dependencias salvo justificación (rate-limit opcional).
- Base de datos de desarrollo puede re-seedearse; producción requiere migración manual.
- El frontend aún no consume la API; cambios de contrato no rompen integración existente.

## 8. Próximo paso

Generar **spec** (SDD) con escenarios Given/When/Then por endpoint afectado y **design** con decisiones de envelope/paginación/autorización. Luego **tasks** desglosadas por WU.