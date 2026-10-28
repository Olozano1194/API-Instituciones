# AGENTS.md — Reglas del proyecto API-Instituciones

> Este archivo define cómo trabajamos en este repo. Los agentes (y humanos) lo leen antes de tocar código.
> Stack: Node.js / Express 4 / MongoDB (Mongoose 8) / JWT / Cloudinary / Swagger. Deploy en Vercel.

## Reglas inquebrantables

1. **Commits en español con Conventional Commits.** Formato: `tipo: descripción` (imperativo, ≤72 chars). Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`.
2. **Ningún commit sin visto bueno del usuario.** Antes de `git commit`, mostrar resumen + diff y esperar aprobación explícita.
3. **Push solo con visto bueno.** Mismo flujo que commit; nunca push automático ni en cadena sin confirmación.
4. **Archivos ≤250 líneas** (código + tests). Si supera, dividir en módulos con responsabilidad clara.
5. **Código junior-friendly:** nombres descriptivos, funciones ≤30 líneas, anidamiento ≤3 niveles, early returns, comentarios solo para el "por qué" no obvio.
6. **SDD apoyado en skills.** Al usar SDD, resolver y cargar las skills de `.agents/skills/` relevantes antes de planificar/implementar. No hardcodear rutas; resolver por nombre. Skills base: `nodejs-best-practices`, `nodejs-express-server`, `nodejs-backend-patterns`.

## Idioma

- Commits, PRs y mensajes de revisión en español.
- Código, identificadores y mensajes mantienen el idioma del codebase existente (español) para consistencia; no mezclar inglés/español en un mismo módulo.
- Docs técnicas (Swagger, README) en español.

## Git y ramas

- Ramas: `feature/<slug>`, `fix/<slug>`, `refactor/<slug>`, `chore/<slug>`.
- Un commit/PR = una responsabilidad.
- No commitear `.env`, secretos, `node_modules/`, `uploads/`.
- Mantener `.env.example` actualizado al agregar variables.
- Merge a `main` solo tras revisión.

## Tamaño y complejidad

- Máx 250 líneas por archivo (incluye tests).
- Funciones ≤30 líneas; extraer helpers con nombre claro.
- Evitar complejidad ciclomática alta; preferir early returns.
- No duplicar lógica; extraer a `utils/` o `services/`.

## Arquitectura

- Mantener MVC flat actual: controllers delgados; lógica de negocio en `services/` si crece.
- Validar entrada en controllers o middleware de validación.
- Manejo de errores centralizado vía middleware de error; no `try/catch` silencioso.
- No exponer stack traces en producción.
- Populate de Mongoose con `.select()` para evitar sobrefetch.

## Seguridad

- JWT validado en middleware `protect`; nunca confiar en datos del cliente sin validar.
- Passwords con bcrypt (salt rounds ≥10).
- Validar tipos y existencia de referencias (ObjectId) antes de guardar.
- CORS: orígenes permitidos por env, no hardcodeados.
- Uploads: validar tipo y tamaño (actual: jpeg/jpg/png ≤3MB).

## Documentación

- Actualizar Swagger (JSDoc en routes/models) al cambiar endpoints.
- README con setup, scripts y variables de entorno.

## Tests

- Infraestructura pendiente. Al agregar tests: Jest o Vitest, en `tests/` o `*.test.js`.
- Cobertura objetivo: ≥70% en controllers y services.
- Tests independientes y rápidos.

## Dependencias

- No agregar dependencias sin justificación en el PR.
- Mantener `package-lock.json` commiteado.
- Auditar vulnerabilidades (`npm audit`) antes de release.

## Skills SDD

- Al planificar con SDD, resolver skills por nombre desde `.agents/skills/` y cargarlas antes de escribir código.
- Skills base para este proyecto: `nodejs-best-practices`, `nodejs-express-server`, `nodejs-backend-patterns`.

## Flujo de aprobación

Antes de cualquier `git commit` o `git push`, presentar resumen de cambios y esperar aprobación explícita del usuario ("ok", "dale", "aprobado", etc.).
