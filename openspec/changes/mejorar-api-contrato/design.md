# Design SDD — "mejorar-api-contrato"

> Proyecto: API-Instituciones (Node/Express 4 + Mongoose 8 + JWT + Cloudinary, deploy Vercel).
> Change: `mejorar-api-contrato`. Fase: DESIGN.
> Artefacto: diseño técnico para implementación (work units WU0–WU5).
> Fuentes: `openspec/changes/mejorar-api-contrato/proposal.md`, `spec.md`, explore #893.

---

## 0. Decisiones resueltas (open questions del spec)

| # | Pregunta abierta | Decisión de design | Motivo |
|---|---|---|---|
| D1 | Campos prohibidos en update: ignorar silenciosamente vs 400 | **Rechazar con 400 `BAD_REQUEST`** si el body incluye campos prohibidos (`rol`, `password`, `idinstitucion`, `email`, `_id`, `createdAt`, `updatedAt`). | Explícito y junior-friendly: el cliente aprende rápido qué no puede tocar. Evita bugs silenciosos donde el front cree que cambió un rol y no lo hizo. |
| D2 | IDOR existencia: 403 vs 404 para no-admin accediendo al perfil de otro | **404 `NOT_FOUND`** cuando un no-admin intenta acceder/modificar un recurso que no le pertenece (o no existe). | No revela existencia de recursos ajenos (anti-enumeración). Admins con rol adecuado sí reciben 403/404 según existencia real. |
| D3 | Lista vacía | **200 `{ data: [], pagination: { page, limit, total: 0 } }`**. Nunca 404 para listados. | Envelope consistente; el front no trata "vacío" como error. |

---

## 1. Envelope de respuesta estándar

### 1.1 Éxito

```json
// Lista
{ "data": [ ... ], "pagination": { "page": 1, "limit": 20, "total": 42 } }

// Único
{ "data": { ... } }

// Creación
201 { "data": { ... } }

// Actualización
200 { "data": { ... } }

// Eliminación
200 { "data": null }
```

- `pagination` solo en listados. `total` = documentos sin filtro de página.
- Nunca se devuelve `message` libre en éxito (consistencia).

### 1.2 Error

```json
{ "error": { "code": "BAD_REQUEST", "message": "Descripción legible" } }
```

- Siempre esa forma. Nunca `{ message }` suelto ni `error: "string"`.
- Códigos (ver spec §0.3): `UNAUTHORIZED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `BAD_REQUEST` 400, `CONFLICT` 409, `VALIDATION_ERROR` 422, `RATE_LIMITED` 429, `INTERNAL_ERROR` 500.

### 1.3 Helpers (centralizados)

Crear `utils/response.js`:

```js
// ok(res, data, status=200)
// created(res, data) -> 201
// noContent(res) -> 204 (preflight)
// fail(res, status, code, message)
// paginated(res, data, { page, limit, total })
```

Todos los controllers usan estos helpers; no se construyen objetos de respuesta ad-hoc.

---

## 2. Paginación

- Query params: `page` (default 1, min 1), `limit` (default 20, max 100).
- Validación en middleware `validatePagination`:
  - parsear con `Number()`, rechazar `NaN`, `<1`, o `limit>100` → 400 `BAD_REQUEST`.
  - clamping no permitido; error explícito (junior-friendly).
- Helper `utils/pagination.js`:

```js
function parsePagination(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  if (!Number.isInteger(page) || page < 1) throw new BadRequestError('page inválido');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new BadRequestError('limit inválido (1-100)');
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
```

- En controllers de listado: `const { page, limit, skip } = parsePagination(req.query);` luego `Model.find(filter).skip(skip).limit(limit)` y `Model.countDocuments(filter)` en paralelo con `Promise.all`.

---

## 3. Authz middleware

Archivo: `middleware/proteccionRutas/authMiddleware.js` (refactor) + nuevo `requireRole.js`.

### 3.1 `protect`

```js
const jwt = require('jsonwebtoken');
const protect = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return fail(res, 401, 'UNAUTHORIZED', 'Token no proporcionado');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, rol: decoded.rol };
    next();
  } catch (err) {
    return fail(res, 401, 'UNAUTHORIZED', 'Token inválido o expirado');
  }
};
```

- Usa `JWT_SECRET`. `JWT_EXPIRES_IN` solo en login (default `7d`).
- Error nunca expone stack.

### 3.2 `requireRole(...roles)` factory

```js
// middleware/proteccionRutas/requireRole.js
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return fail(res, 401, 'UNAUTHORIZED', 'No autenticado');
  if (!roles.includes(req.user.rol)) {
    return fail(res, 403, 'FORBIDDEN', 'No tienes permisos para esta acción');
  }
  next();
};
module.exports = requireRole;
```

- Uso: `router.post('/', protect, requireRole('admin', 'superadmin'), createInstitucion)`.
- Roles comparados por **nombre** (string), consistente con payload JWT `{ id, rol }`.

---

## 4. Validación (dependency-free, centralizada en middleware)

No se agrega `express-validator`/`zod`. Validación manual en middleware reutilizable.

### 4.1 Estructura

```
middleware/validation/
  ├── validateObjectId.js      // param :id válido
  ├── validatePagination.js    // page/limit
  ├── validateBody.js          // factory genérico con schema declarativo
  └── schemas/
      ├── usuarioSchema.js
      ├── institucionSchema.js
      └── municipioSchema.js
```

### 4.2 `validateBody(schema)` factory

Schema declarativo mínimo (junior-friendly):

```js
// schema ejemplo
{
  email: { required: true, type: 'string', email: true },
  password: { required: true, type: 'string', minLength: 8 },
  rol: { required: true, type: 'objectId' }
}
```

El middleware:
1. Verifica campos `required`.
2. Verifica `type` (`string`, `number`, `objectId`, `array`).
3. Verifica `minLength`, `maxLength`, `email`, `enum`.
4. Rechaza campos prohibidos listados en `schema.forbidden` → 400 `BAD_REQUEST` "Campo no permitido: X" (resuelve D1).
5. Campos no declarados → ignorados (whitelist), pero si están en `forbidden` → 400.

### 4.3 Campos prohibidos (whitelist de update)

Por entidad, definir `FORBIDDEN_UPDATE_FIELDS`:

- Usuario: `['_id', 'password', 'rol', 'idinstitucion', 'email', 'createdAt', 'updatedAt']` en PATCH/PUT de perfil propio. Admin actualizando tercero: puede cambiar subset permitido (email? no — solo `fotoPerfil` y campos de perfil no sensibles). Password solo vía endpoint dedicado (fuera de alcance este slice).
- Institucion: `['_id', 'estudiantes', 'profesores', 'createdAt', 'updatedAt']` (relaciones se gestionan por sus propios endpoints).
- Municipio: `['_id', 'createdAt', 'updatedAt']`.

Si el body contiene alguno → 400 `BAD_REQUEST` con `message: "Campo no permitido: <campo>"`.

> Nota: esto cambia la decisión del spec §3.4 ("ignorar silenciosamente") por decisión de design D1. Spec se actualiza en apply.

---

## 5. Municipio FK: ObjectId ref Departamento

### 5.1 Modelo

```js
// models/municipioModel.js
const mongoose = require('mongoose');
const MunicipioSchema = new mongoose.Schema({
  id_municipio: { type: String, required: true, unique: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  id_departamento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departamento',
    required: true
  }
}, { timestamps: true });
module.exports = mongoose.model('Municipio', MunicipioSchema);
```

### 5.2 Validación de FK en create/update

En controller de municipio:

```js
if (!mongoose.Types.ObjectId.isValid(req.body.id_departamento)) {
  return fail(res, 400, 'BAD_REQUEST', 'ID de departamento inválido');
}
const dep = await Departamento.findById(req.body.id_departamento).select('_id');
if (!dep) return fail(res, 400, 'BAD_REQUEST', 'El departamento no existe');
```

### 5.3 Populate

```js
Municipio.find().populate('id_departamento', 'descripcion id_departamento')
```

Ya no retorna null si la FK es válida.

### 5.4 Migración de datos

Fuera de alcance de código (P2 mínimo). Documentar en README: municipios existentes con `id_departamento` String deben re-mapearse; en dev se re-ejecuta seed `initMunicipio`. En prod, script de migración manual (no incluido en slice).

---

## 6. CORS

`app.js`:

```js
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.options('*', (req, res) => res.sendStatus(204));
```

- Eliminar headers manuales hardcodeados y `app.use(cors())` sin config.
- Error de origen no permitido → el middleware de error lo convierte en 403/ sin ACAO (cors lib maneja). No exponer datos.

---

## 7. JWT

- Estandarizar en `JWT_SECRET` (ya en `.env.example`). Eliminar toda referencia a `SECRET_KEY`.
- `JWT_EXPIRES_IN` default `7d`.
- Payload: `{ id, rol }` (rol = nombre del rol, string).
- Login firma con `jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })`.

---

## 8. Error middleware

```js
// middleware/errorHandler.js
const isProd = process.env.NODE_ENV === 'production';

module.exports = (err, req, res, next) => {
  // CORS origin error
  if (err && err.message === 'Origen no permitido por CORS') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Origen no permitido' } });
  }
  console.error('[ERROR]', err.stack || err);
  const status = err.status || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const message = isProd
    ? (status === 500 ? 'Error interno del servidor' : (err.publicMessage || 'Error en la solicitud'))
    : (err.message || 'Error');
  res.status(status).json({ error: { code, message } });
};
```

- Stack solo en logs (`console.error`), nunca en respuesta.
- En dev se puede incluir `err.message` original; en prod solo mensaje genérico para 500.
- Mongoose `ValidationError`/`CastError` → mapear a 400 `VALIDATION_ERROR` con mensaje legible (helper `mapMongooseError`).

Registrar como último middleware en `app.js`: `app.use(errorHandler)`.

---

## 9. Upload (multer) — path safety

Mantener `middleware/upload.js` con mejoras:

- Directorio de destino: `path.join(__dirname, '..', 'uploads')` (ya absoluto).
- Validar que el nombre final no escape del directorio (path traversal): usar `path.basename`, rechazar `..` y separadores.
- `filename`: `Date.now() + '-' + crypto.randomUUID() + ext` (no confiar en originalname para el nombre final; solo para ext).
- Validar extensión contra allowlist `['.jpg', '.jpeg', '.png']` y mimetype.
- Límite 3MB (ya).
- En producción (Vercel, filesystem efímero), documentar que uploads deben ir a Cloudinary; multer solo para dev. No bloquear.

```js
const crypto = require('crypto');
const safeExt = path.extname(file.originalname).toLowerCase();
if (!['.jpg', '.jpeg', '.png'].includes(safeExt)) return cb(new Error('Extensión no permitida'));
const filename = `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
```

---

## 10. IDOR handling (resuelve D2)

- Recursos propios: endpoints `/me` usan `req.user.id`, nunca `:id` del URL.
- Endpoints genéricos con `:id` (PUT/DELETE usuario, instituciones, etc.):
  - Si el recurso no existe → 404 `NOT_FOUND`.
  - Si existe pero el usuario no es propietario ni tiene rol admin/superadmin → **404 `NOT_FOUND`** (no revela existencia).
  - Admin/superadmin → permite (con whitelist).
- Implementar helper `ensureOwnershipOrAdmin(req, resourceOwnerId)`:
  ```js
  function canAccess(req, ownerId) {
    if (req.user.rol === 'admin' || req.user.rol === 'superadmin') return true;
    return String(ownerId) === String(req.user.id);
  }
  ```
  Si no puede → responder 404 (no 403) para recursos de usuario/perfil.

> Nota: esto difiere del spec §7 ("403 si autenticado pero sin permiso"). Design decide 404 para no-admin sobre recursos ajenos (anti-enumeración). Spec se actualiza en apply.

---

## 11. Estructura de archivos resultante

```
utils/
  response.js          # ok/created/paginated/fail
  pagination.js        # parsePagination
  enriquecerUsuario.js  # (existente)
middleware/
  errorHandler.js      # global error handler
  proteccionRutas/
    authMiddleware.js  # protect (refactor)
    requireRole.js     # factory
  validation/
    validateBody.js
    validateObjectId.js
    validatePagination.js
    schemas/
      usuarioSchema.js
      institucionSchema.js
      municipioSchema.js
models/
  municipioModel.js    # id_departamento ObjectId ref Departamento
  usuarioModel.js      # password required+minlength+select:false, idinstitucion ObjectId
```

---

## 12. Work units (implementación)

| WU | Contenido | Archivos clave |
|---|---|---|
| WU0 | Security core: JWT env, CORS env, password schema, error sanitize, authMiddleware 401 + requireRole | authMiddleware, app.js, usuarioModel, errorHandler |
| WU1 | Mass-assignment guard + types + roles | validateBody, schemas, institucionController |
| WU2 | Routes plural + envelope + pagination | routes/*, controllers listados, utils/response, pagination |
| WU3 | Municipio FK ObjectId + populate | municipioModel, municipioController |
| WU4 | Profile creation by secretaría + /me endpoints | usuariosController, estudiante/profesor/admin controllers |
| WU5 | Cleanup + Swagger + docs | routes JSDoc, README, .env.example |

Cada WU ≤ 400 líneas de diff aprox; revisión por WU (ask-on-risk).

---

## 13. Criterios de verificación (design-level)

- `npm start` con `JWT_SECRET` verifica tokens.
- Token inválido → 401 `{ error: { code: 'UNAUTHORIZED' } }` sin stack en prod.
- CORS permite origen de env, rechaza otros, preflight 204.
- Update con campo prohibido → 400 `BAD_REQUEST`.
- Listados → `{ data, pagination }`.
- `GET /api/municipios/:id` populate departamento no null.
- Empty list → 200 `{ data: [], pagination: { total: 0 } }`.
- IDOR no-admin → 404.
- Ningún archivo >250 líneas; funciones ≤30.

---

## 14. Riesgos

- Municipio FK change requiere re-seed en dev (initMunicipio). Datos prod no migrados automáticamente.
- Envelope change rompe consumidores existentes (ninguno en prod aún; frontend en construcción).
- Route renames (/api/usuario → /api/usuarios) rompen callers viejos; mantener alias temporal si barato (decisión: alias en WU2, remover en WU5).
