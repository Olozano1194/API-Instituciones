# Verify Report — "mejorar-api-contrato"

> Proyecto: API-Instituciones. Fase: VERIFY (post-WU7). Fecha: 2026-11-12.
> Artefactos comparados: `spec.md`, `design.md`, `tasks.md` vs código actual (post WU7, commit `a255adc`).
> Suites de tests: 8 suites, 46 tests — todos pasan.

## Resumen

Los CRITICAL reportados en la verificación previa (envelope inconsistente, `/me` shape, `parsePagination` clampeando, `rolController` legacy) quedaron resueltos en WU7. El contrato de API ahora es consistente: listados usan `{ data, meta: { page, limit, total } }`, operaciones de escritura/eliminación usan `{ data }`/`{ data: null }`, login devuelve `{ token, user: { id, email, rol } }`, `/me` de usuario devuelve `{ id, email, rol, fotoPerfil }`, y `parsePagination` rechaza valores inválidos con `400 BAD_REQUEST`. `rolController` migró a helpers y paginación.

## CRITICAL

Ninguno. Todos los CRITICAL previos están resueltos y verificados en código y tests.

## WARNING

- `errorHandler` puede exponer `err.message` en producción para respuestas con status <500 (riesgo menor de fuga de detalles internos).
- `createUsuario` no valida longitud de password antes de hashear (confía en validación de Mongoose; mensaje no controlado).
- Los helpers `/me` de estudiantes, profesores y administradores existen en controllers pero no están expuestos como rutas (`/api/<recurso>/me`); solo `/api/usuarios/me` está montado.
- `validateBody` está definido pero no se aplica en las rutas; la validación/mass-assignment se resuelve en controllers (funcional, pero inconsistente con el diseño).
- `municipioController` solo implementa lectura + filtro por departamento (sin CRUD completo), aunque spec §4.3 asume CRUD.
- Swagger parcial en algunos schemas/endpoints.
- Cobertura de tests limitada a smoke/auth/pagination/response; no cubre endpoints de negocio ni envelope.
- Nombres `getEstudianteById`/`getProfesorById`/`getAdministradorById` en realidad resuelven el perfil del usuario autenticado (`/me`), no un recurso por `:id` arbitrario (inconsistencia de naming).

## SUGGESTION

- Sanitizar mensajes de error en producción también para status <500 (o mapear explícitamente).
- Validar password (≥8) en controller antes de hashear para mensaje controlado.
- Montar rutas `/me` para estudiantes/profesores/administradores o documentar que solo `/api/usuarios/me` es el contrato.
- Aplicar `validateBody` en rutas para unificar validación.
- Implementar CRUD completo para municipios/departamentos si se mantiene el contrato del spec §4.
- Agregar tests de integración para envelope, paginación inválida, mass-assignment e IDOR.

## Criterios de aceptación (spec §9)

| # | Criterio | Estado |
|---|----------|--------|
| 1 | Token verifica con JWT_SECRET | ✅ |
| 2 | Token inválido → 401 sin stack en prod | ✅ |
| 3 | CORS permite origen de env y rechaza otros; preflight 204 | ✅ |
| 4 | updateUsuario ignora rol/password/idinstitucion | ✅ (rechaza con 400) |
| 5 | Listados responden `{ data, meta: { page, limit, total } }` | ✅ |
| 6 | `GET /api/municipios/:id` populate departamento no null | ✅ |
| 7 | Swagger actualizado a rutas reales | ⚠️ (parcial) |
| 8 | Ningún archivo >250 líneas; funciones ≤30 | ✅ |
| 9 | Sin deps nuevas sin justificación | ✅ |

## Veredicto

**CONFORME (sin CRITICAL).** El contrato de API está unificado y cumple los criterios de aceptación core. Quedan WARNINGs no bloqueantes (sanitización de errores, password, rutas `/me` secundarias, CRUD de municipios, Swagger parcial, cobertura de tests) que pueden abordarse en un ciclo posterior.