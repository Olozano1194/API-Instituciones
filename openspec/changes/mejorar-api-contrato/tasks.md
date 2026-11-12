# Tasks SDD — "mejorar-api-contrato"

> Proyecto: API-Instituciones. Artefacto: tasks (checklist por work unit WU0–WU5).
> Fuente: proposal.md, spec.md, design.md. Skills cargadas: nodejs-best-practices, nodejs-express-server, nodejs-backend-patterns.
> Estrategia de entrega: **ask-on-risk** (sin commit/push sin visto bueno). `chain_strategy`: TBD — preguntar si un WU supera 400 líneas o perjudica la revisión.

---

## Grafo de dependencias

```
WU0 (seguridad core)
 └─► WU1 (mass-assignment + tipos + roles)
      └─► WU2 (rutas plurales + envelope + paginación)
           └─► WU3 (FK municipio ObjectId + populate)  [puede paralelizarse con WU2 tras WU1]
                └─► WU4 (creación de perfiles por secretaría + /me)
                     └─► WU5 (limpieza + Swagger + docs)
```

---

## WU0 — Baseline y seguridad mínima (P0 core)

**Depende de:** nada. **Bloquea:** WU1–WU5.

- [x] **T0.1** Actualizar `.env.example`: documentar `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_ORIGIN`, `NODE_ENV`. (`.env.example`)
- [x] **T0.2** Crear `utils/response.js` con helpers `ok`, `created`, `paginated`, `fail`, `noContent`. (nuevo)
- [x] **T0.3** Refactor `middleware/proteccionRutas/authMiddleware.js`: `protect` usa `JWT_SECRET`, responde 401 vía `fail`, setea `req.user = { id, rol }`. (depende T0.2)
- [x] **T0.4** Crear `middleware/proteccionRutas/requireRole.js` factory (403 si rol no permitido). (nuevo)
- [x] **T0.5** Crear `middleware/errorHandler.js` global sanitizado + `mapMongooseError`; registrar como último middleware en `app.js`. (nuevo)
- [x] **T0.6** Refactor `app.js`: CORS por env (origin callback, credentials, methods, headers), eliminar headers hardcodeados a `localhost:5173` y `cors()` sin config; registrar `errorHandler`. (depende T0.5)
- [x] **T0.7** Actualizar `models/usuarioModel.js`: `password` required + minlength 8 + select:false; `idinstitucion` ObjectId ref `Institucion`.
- [x] **T0.8** Actualizar `controllers/usuariosController.js`: login firma con `JWT_SECRET`/`JWT_EXPIRES_IN` (default `7d`), payload `{ id, rol }`; bcrypt salt ≥10; eliminar referencias a `SECRET_KEY`.
- [x] **T0.9** Smoke test manual y validación automatizada de autenticación (40 tests en Jest/Supertest).

---

## WU1 — Mass-assignment + tipos + roles

**Depende de:** WU0.

- [x] **T1.1** Crear `middleware/validation/validateBody.js` factory + `validateObjectId.js`. (nuevos)
- [x] **T1.2** Crear schemas: `middleware/validation/schemas/usuarioSchema.js`, `institucionSchema.js`, `municipioSchema.js` con campos prohibidos por entidad.
- [x] **T1.3** Crear `utils/pagination.js` con `parsePagination` (page default 1 min 1; limit default 20 max 100).
- [x] **T1.4** Aplicar whitelist de actualización en `controllers/institucionController.js`, `municipioController.js`, `departamentoController.js` (rechazar campo prohibido → 400 `BAD_REQUEST`).
- [x] **T1.5** Aplicar guard de mass-assignment en `controllers/usuariosController.js` (updateUsuario) rechazando `rol`, `password`, `idinstitucion`, `email`, `_id`, timestamps.
- [x] **T1.6** Verificar `idinstitucion` ObjectId en `Usuario` (completado en T0.7).
- [x] **T1.7** Agregar guards `requireRole` en rutas de escritura (admin/superadmin) en `routes/*Routes.js`.

---

## WU2 — Contrato de rutas y envelope

**Depende de:** WU0, WU1.

- [x] **T2.1** Refactor controladores de listado para usar `paginated` + `countDocuments` en paralelo (`Promise.all`); excluir password.
- [x] **T2.2** Pluralizar rutas: `/api/usuarios`, `/api/estudiantes`, `/api/profesores`, `/api/administradores`; mantener aliases temporales `/api/usuario`, etc. (routes + registro en `app.js`).
- [x] **T2.3** Estandarizar endpoints `/me`: `GET/PATCH /api/<recurso>/me` usando `req.user.id` (usuarios, estudiantes, profesores, administradores).
- [x] **T2.4** Actualizar registro de rutas en `app.js` (montaje de routers).
- [x] **T2.5** Actualizar Swagger JSDoc en `routes/*` a rutas reales y tags correctos.
- [x] **T2.6** Smoke test: listados devuelven `{ data, pagination }`; `/me` funciona sin `:id`.

---

## WU3 — Modelo municipio FK + populate

**Depende de:** WU0 (puede paralelizarse con WU2 tras WU1).

- [x] **T3.1** Actualizar `models/municipioModel.js`: `id_departamento` → `ObjectId` ref `Departamento` (required).
- [x] **T3.2** Actualizar `controllers/municipioController.js`: validar existencia de FK en create/update; populate `id_departamento` en list/get.
- [x] **T3.3** Actualizar `middleware/initMunicipio.js` (seed) para usar ObjectId o documentar re-seed.
- [x] **T3.4** Actualizar populate en `controllers/institucionController.js` (municipio/departamento con `.select`).
- [x] **T3.5** Documentar migración/re-seed en README (dev) y nota para prod.

---

## WU4 — Creación de perfiles por secretaría (mínimo)

**Depende de:** WU0, WU1, WU2, WU3.

- [x] **T4.1** `POST /api/usuarios` scoped a institución del admin autenticado: valida rol, hashea bcrypt, crea perfil correspondiente (Estudiante/Profesor/Admin) vinculado, `idinstitucion` desde admin (no body), rollback si falla el perfil. (`controllers/usuariosController.js`, `routes/usuarioRoutes.js`)
- [x] **T4.2** Unificación arquitectónica de creación de perfiles en POST /api/usuarios (Single Source of Truth para altas de identidad y vinculación de perfiles).
- [x] **T4.3** Validar referencias ObjectId existentes (rol) → 400 si inválidas. (`controllers/usuariosController.js`)
- [x] **T4.4** `/me` (GET/PATCH) para usuario usando `req.user.id` + lookup de perfil por rol. (`controllers/usuariosController.js`, `routes/usuarioRoutes.js`)
- [x] **T4.5** Helper `ensureOwnershipOrAdmin` en `utils/ensureOwnershipOrAdmin.js` (404 para no-propietario no-admin, anti-enumeración).

---

## WU5 — Limpieza y docs

**Depende de:** WU0–WU4.

- [x] **T5.1** Eliminar `console.log` comentados; convertir `setTimeout` de init a `await` secuencial en `app.js`. (`app.js`)
- [x] **T5.2** Completar Swagger JSDoc en todas las rutas (paths reales). (`config/swagger.js`, `models/schemas/*.js`, `routes/*.js`)
- [x] **T5.3** Crear `README.md`: setup, scripts, variables de entorno, notas de migración.
- [x] **T5.4** Aliases temporales ya eliminados (cutover duro en WU2).
- [x] **T5.5** Smoke test final y validación automatizada de endpoints (suite de 46 tests pasando + CI en GitHub Actions + PR #8 mergeado a master).

---

## Review Workload Forecast

| WU | Líneas cambiadas (est.) | Archivos tocados | Chained PR recomendado | Riesgo presupuesto 400 líneas | Decisión necesaria antes de apply |
|---|---|---|---|---|---|
| WU0 | ~180 | 8 | No | Bajo | Ninguna (seguridad core) |
| WU1 | ~150 | 9 | No | Bajo | Confirmar validación sin libs (dependency-free) |
| WU2 | ~300 | 12+ | Considerar split si >350 | Medio-Alto | Alias temporal vs cutover duro en rutas |
| WU3 | ~90 | 4 | No | Bajo | Re-seed dev vs script de migración |
| WU4 | ~220 | 6 | No | Bajo-Medio | ¿Se emite token al crear perfil por admin? (spec: no) |
| WU5 | ~120 | varios | No | Bajo | Momento de remover aliases |

**Total estimado:** ~1060 líneas distribuidas en 6 PRs revisables (≤~400 c/u). Ningún WU individual supera 400 en estimación; WU2 es el de mayor riesgo y debe monitorearse durante apply (si supera 350, dividir en WU2a rutas/envelope y WU2b paginación/Swagger).

## Estrategia de entrega

- **ask-on-risk:** cada WU se presenta con resumen + diff y requiere aprobación explícita ("ok/dale/aprobado") antes de commit.
- **chain_strategy:** TBD — preguntar al usuario si un WU supera 400 líneas o si conviene encadenar PRs (chained-pr) por revisión. Por defecto, un PR por WU.
- No se avanza al siguiente WU sin smoke test manual exitoso del actual.