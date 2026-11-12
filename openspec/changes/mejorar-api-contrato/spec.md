# Spec SDD — "mejorar-api-contrato"

> Proyecto: API-Instituciones (Node/Express 4 + Mongoose 8 + JWT + Cloudinary, deploy Vercel).
> Change: `mejorar-api-contrato`. Fase: SPEC.
> Artefacto: especificación con escenarios Given/When/Then por endpoint afectado.
> Fuente: `openspec/changes/mejorar-api-contrato/proposal.md` + explore #893.

---

## 0. Convenciones transversales

### 0.1 Envelope de respuesta

- Listas: `{ data: [...], meta: { page, limit, total } }`.
- Single: `{ data: <entity> }`.
- Errores: `{ error: { code, message } }` (sin stack, sin detalles internos en producción).
- Creación exitosa: `201` con `{ data }`. Actualización: `200` con `{ data }`. Eliminación: `200` con `{ data: null, message? }` o `{ message }` normalizado a `{ data: null }`? Decisión: eliminación responde `200 { data: null }` (sin mensaje libre) para consistencia. *Nota: se admite `{ message }` solo si se documenta; preferir `{ data: null }`.*

### 0.2 Paginación

- Query params `page` (default 1, min 1) y `limit` (default 20, max 100).
- `meta.total` = total de documentos sin filtro de página.
- Si `page` inválido → `400 { error: { code: "BAD_REQUEST" } }`.

### 0.3 Códigos de error

| Código | HTTP | Descripción |
|---|---|---|
| `UNAUTHORIZED` | 401 | Sin token o token inválido/expirado |
| `FORBIDDEN` | 403 | Autenticado pero sin permiso (rol) |
| `NOT_FOUND` | 404 | Recurso no existe |
| `BAD_REQUEST` | 400 | Input inválido |
| `CONFLICT` | 409 | Duplicado (email, etc.) |
| `VALIDATION_ERROR` | 422 | Schema válido pero regla de negocio falla |
| `RATE_LIMITED` | 429 | Demasiadas requests |
| `INTERNAL_ERROR` | 500 | Error del servidor (sin detalles) |

### 0.4 Autenticación

- JWT firmado con `process.env.JWT_SECRET`, expiración `process.env.JWT_EXPIRES_IN` (default `7d`).
- Payload: `{ id, rol }` (rol = nombre del rol).
- Header: `Authorization: Bearer <token>`.
- `protect` middleware: 401 si no hay token o token inválido/expirado.
- `requireRole(...roles)` middleware: 403 si el rol del token no está en la lista.

### 0.5 CORS

- Orígenes permitidos desde `FRONTEND_ORIGIN` (lista separada por coma).
- `credentials: true` coherente.
- Preflight `OPTIONS` responde 204 con headers correctos.
- Sin headers hardcodeados a `localhost:5173`.

---

## 1. Auth

### 1.1 Login

**Endpoint:** `POST /api/auth/login` (equivalente actual `POST /api/usuario/login`; se estandariza a `/api/auth/login` o se mantiene alias. Spec asume `/api/auth/login` con alias temporal `/api/usuario/login` si es barato.)

**Escenario: login exitoso**
- Given un usuario registrado con email `a@b.com` y password válido, rol `admin`.
- When `POST /api/auth/login` con `{ email, password }`.
- Then `200` y body `{ data: { token, user: { id, email, rol } } }`; token firmado con `JWT_SECRET` y expira según `JWT_EXPIRES_IN`; password no presente.

**Escenario: credenciales inválidas (email inexistente)**
- Given no existe usuario con email `x@b.com`.
- When login con ese email.
- Then `401` o `400` (decisión: `401 UNAUTHORIZED` con mensaje genérico "Credenciales inválidas") sin revelar si el email existe.

**Escenario: password incorrecto**
- Given usuario existe.
- When login con password erróneo.
- Then `401 UNAUTHORIZED` "Credenciales inválidas".

**Escenario: body incompleto**
- Given request sin email o password.
- When login.
- Then `400 BAD_REQUEST` "Email y contraseña son requeridos".

### 1.2 Verificación de token (JWT_SECRET)

**Escenario: token válido**
- Given token firmado con `JWT_SECRET`.
- When request a ruta protegida con `Authorization: Bearer <token>`.
- Then `protect` decodifica, setea `req.user = { id, rol }`, continúa.

**Escenario: token firmado con otro secret**
- Given token firmado con secret distinto.
- When request protegida.
- Then `401 UNAUTHORIZED`, sin stack.

**Escenario: token expirado**
- Given token con exp en el pasado.
- When request protegida.
- Then `401 UNAUTHORIZED`.

### 1.3 Rutas protegidas (401/403)

**Escenario: sin token**
- Given request sin header Authorization.
- When `GET /api/usuarios`.
- Then `401 { error: { code: "UNAUTHORIZED", message: "..." } }`.

**Escenario: token inválido**
- Given header con token malformado.
- When request protegida.
- Then `401 UNAUTHORIZED`.

**Escenario: rol insuficiente**
- Given token de usuario con rol `estudiante`.
- When `POST /api/instituciones` (requiere `superadmin`/`admin`).
- Then `403 FORBIDDEN`.

---

## 2. CORS

**Escenario: origen permitido**
- Given `FRONTEND_ORIGIN=http://localhost:5173`.
- When request con `Origin: http://localhost:5173`.
- Then respuesta incluye `Access-Control-Allow-Origin: http://localhost:5173` y `Vary: Origin`.

**Escenario: origen no permitido**
- Given origen `https://evil.com` no listado.
- When request.
- Then no se refleja el origen; respuesta sin ACAO (o 403 según config); no expone datos sensibles.

**Escenario: preflight OPTIONS**
- Given cualquier ruta.
- When `OPTIONS` con `Access-Control-Request-Method: POST` y origen permitido.
- Then `204` (o `200`) con `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials: true`; sin body.

**Escenario: lista de orígenes**
- Given `FRONTEND_ORIGIN=http://a.com,http://b.com`.
- When request desde `http://b.com`.
- Then permitido.

---

## 3. Usuarios (User CRUD)

### 3.1 Crear usuario (por secretaría/admin)

**Endpoint:** `POST /api/usuarios` (protegido, requiere rol `admin` o `superadmin`).

**Escenario: creación exitosa por admin de institución**
- Given admin autenticado con `idinstitucion = X`.
- When `POST /api/usuarios` con `{ email, password, rol }` (rol estudiante/docente/admin).
- Then `201 { data: { id, email, rol } }`; password hasheado con bcrypt salt ≥10; se crea perfil correspondiente (Estudiante/Profesor/Admin) vinculado; `idinstitucion` se asigna desde el admin autenticado (no desde body); token opcional/no devuelto (creación por admin no emite token de sesión, o emite si se decide; spec: no emite token, devuelve usuario).

**Escenario: rol inválido**
- Given rol id no existe.
- When crear usuario.
- Then `400 BAD_REQUEST` "El rol especificado no existe".

**Escenario: email duplicado**
- Given email ya registrado.
- When crear.
- Then `409 CONFLICT`.

**Escenario: password débil**
- Given password < 8 caracteres.
- When crear.
- Then `400/422 VALIDATION_ERROR` "Password debe tener al menos 8 caracteres".

**Escenario: mass-assignment en creación**
- Given body incluye `{ rol, password, idinstitucion, password }` extra.
- When crear.
- Then solo campos permitidos (email, password, rol) se usan; `idinstitucion` se toma del admin autenticado, no del body; campos desconocidos ignorados.

### 3.2 Listar usuarios

**Endpoint:** `GET /api/usuarios` (protegido, admin/superadmin).

- Given usuarios en DB.
- When `GET /api/usuarios?page=1&limit=20`.
- Then `200 { data: [...], meta: { page, limit, total } }`; cada item `{ id, email, rol }`; password nunca incluido (select:false); populate rol con `.select('nombre')`.

### 3.3 Obtener perfil propio (me)

**Endpoint:** `GET /api/usuarios/me` (protegido, cualquier rol).

- Given usuario autenticado.
- When `GET /api/usuarios/me`.
- Then `200 { data: { id, email, rol, fotoPerfil } }`; usa `req.user.id`, no `:id` en URL.

### 3.4 Actualizar perfil propio (me) — mass-assignment guard

**Endpoint:** `PATCH /api/usuarios/me` (protegido).

**Escenario: actualización de campos permitidos**
- Given usuario autenticado.
- When `PATCH /api/usuarios/me` con `{ fotoPerfil }` o campos permitidos.
- Then `200 { data: usuarioActualizado }`; solo campos en whitelist se aplican.

**Escenario: mass-assignment intentado**
- Given body `{ rol, password, idinstitucion, email }`.
- When patch.
- Then esos campos se ignoran (no persisten); respuesta `200` sin error, pero valores no cambian. Alternativamente `400` si se envían campos prohibidos; spec: ignorar silenciosamente (whitelist) y documentar. *Decisión final en design: ignorar silenciosamente.*

**Escenario: IDOR — actualizar otro usuario**
- Given usuario A intenta `PUT /api/usuarios/:id` de usuario B.
- When request.
- Then `403 FORBIDDEN` (o `404` para no revelar existencia). Spec: `403 FORBIDDEN` si autenticado pero no propietario/admin; si no existe, `404`.

### 3.5 Eliminar usuario

**Endpoint:** `DELETE /api/usuarios/:id` (protegido, admin/superadmin o propio).

- Given usuario existe.
- When delete por admin.
- Then `200 { data: null }`; (cascade de perfil documentado como pendiente P3; en este slice se elimina solo Usuario o se intenta cascade best-effort; spec: eliminar Usuario; perfil orphan documentado).

### 3.6 Password no retornado

- Given cualquier endpoint que devuelva usuario.
- When respuesta.
- Then campo `password` ausente (select:false + proyección explícita).

---

## 4. Instituciones / Departamentos / Municipios

### 4.1 Instituciones

**Endpoints:** `GET/POST /api/instituciones`, `GET/PUT/DELETE /api/instituciones/:id` (protegidos).

**Listar:**
- Given instituciones.
- When `GET /api/instituciones?page=1&limit=20`.
- Then `200 { data: [...], meta }`; populate `iddepartamento` (select 'descripcion'), `idmunicipio` (select 'descripcion'), estudiantes/profesores (select 'nombre apellido').

**Crear:**
- Given body válido con `iddepartamento`, `idmunicipio` ObjectId válidos.
- When `POST /api/instituciones`.
- Then `201 { data: institucion }`; FKs validadas (existencia); mass-assignment guard (whitelist de campos editables).

**FK inválida:**
- Given `iddepartamento` no existe o no es ObjectId.
- When crear.
- Then `400 BAD_REQUEST` "ID de departamento inválido" / "departamento no existe".

**Obtener por id:**
- Given id existe.
- When `GET /api/instituciones/:id`.
- Then `200 { data }` con populate.
- Given id no existe → `404 NOT_FOUND`.

**Actualizar:**
- Given id existe.
- When `PUT /api/instituciones/:id` con campos permitidos.
- Then `200 { data }`; campos prohibidos ignorados.

**Eliminar:**
- Given id existe.
- When `DELETE`.
- Then `200 { data: null }`.

### 4.2 Departamentos

**Endpoints:** `GET /api/departamentos` (público), CRUD protegido (write).

- Public read: `GET /api/departamentos` sin token → `200 { data: [...], meta }`.
- Create/update/delete requieren auth + rol admin/superadmin.
- FK: `id_departamento` único.

### 4.3 Municipios

**Endpoints:** `GET /api/municipios`, `GET /api/municipios/by-departamento?departamento=`, CRUD.

**Modelo fix:** `id_departamento` es `ObjectId ref 'Departamento'`.

**Escenario: populate funciona**
- Given municipio con `id_departamento` = departamento existente.
- When `GET /api/municipios/:id` o listado con populate.
- Then departamento completo (no null) en `id_departamento`.

**Escenario: filtro por departamento**
- Given `?departamento=<ObjectId>`.
- When request.
- Then municipios del departamento; `404` si ninguno (o `200 { data: [] }`? Spec: `200 { data: [], meta }` para consistencia; no 404 para lista vacía. *Decisión: lista vacía = 200 con data [].*)

**Escenario: FK inválida al crear municipio**
- Given `id_departamento` inexistente.
- When crear.
- Then `400 BAD_REQUEST`.

---

## 5. Roles

**Endpoints:** `GET /api/roles` (público), `GET /api/roles/:id`, `POST/PUT/DELETE` (protegidos).

- Public read: sin token → `200 { data: [...] }`.
- Write: requiere auth + rol admin/superadmin → sin token `401`, token sin permiso `403`.
- `GET /api/roles/:id` público? Spec: lectura por id público (consistente con listado). Write protegido.

---

## 6. Error handling

**Escenario: error en producción**
- Given `NODE_ENV=production`.
- When cualquier error no controlado.
- Then respuesta `500 { error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" } }`; sin stack, sin `err.message`, sin detalles.

**Escenario: error en desarrollo**
- Given `NODE_ENV=development`.
- When error.
- Then puede incluir `message` original pero no stack al cliente (stack solo en logs).

**Escenario: forma consistente**
- Given cualquier endpoint de error.
- When respuesta de error.
- Then body siempre `{ error: { code, message } }`; nunca `{ message }` suelto ni `error: err.message` string.

**Escenario: validación Mongoose**
- Given input que viola schema (required, minlength).
- When request.
- Then `400/422` con `code: "VALIDATION_ERROR"` o `"BAD_REQUEST"` y mensaje legible.

---

## 7. IDOR

**Escenario: usuario actualiza propio perfil**
- Given usuario autenticado A.
- When `PATCH /api/usuarios/me`.
- Then actualiza A; `200`.

**Escenario: usuario intenta actualizar perfil de otro**
- Given usuario A autenticado.
- When `PUT/PATCH /api/usuarios/:id` con id de B.
- Then `403 FORBIDDEN` (o `404`); no modifica B.

**Escenario: admin puede actualizar tercero**
- Given admin autenticado.
- When `PUT /api/usuarios/:id`.
- Then permite (con whitelist); `200`.

**Escenario: rutas con `:id` genéricas**
- Given cualquier recurso con `:id`.
- When usuario no propietario y no admin.
- Then `403`/`404`; no fuga de existencia preferiblemente `404` para recursos no propios (decisión de seguridad: devolver 404 para no revelar existencia). Spec: `403` si autenticado pero sin permiso; `404` si recurso no existe. Para IDOR sobre existente de otro usuario, devolver `403` (o `404` por decisión de design). *Marcar como decisión abierta para design.*

---

## 8. Rate limiting (opcional)

- `POST /api/auth/login` y `POST /api/usuarios` (registro) limitados a N req/min por IP (ej. 10/min).
- Exceso → `429 RATE_LIMITED` con `Retry-After`.

---

## 9. Criterios de aceptación (medibles)

1. Token emitido por login verifica con `JWT_SECRET` en `protect`.
2. Token inválido → `401 { error: { code: "UNAUTHORIZED" } }` sin stack en producción.
3. CORS permite origen de env y rechaza otros; preflight 204.
4. `updateUsuario` ignora `rol/password/idinstitucion` del body.
5. Listados responden `{ data, meta: { page, limit, total } }`.
6. `GET /api/municipios/:id` populate departamento no null.
7. Swagger actualizado a rutas reales.
8. Ningún archivo >250 líneas; funciones ≤30.
9. Sin deps nuevas sin justificación.

---

## 10. Fuera de alcance (recordatorio)

Notas/tareas/clases, cascade delete completo, P4 limpieza profunda, migración de datos, tests automatizados.
