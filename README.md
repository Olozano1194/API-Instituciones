# API-Instituciones

API REST para gestionar instituciones educativas, usuarios por rol, departamentos y municipios.

## Stack

- Node.js 24.x / Express 4
- MongoDB (Mongoose 8)
- JWT + bcrypt
- Cloudinary + Multer (uploads)
- Swagger (OpenAPI 3.0)

## Scripts

- `npm start` — inicia el servidor (local).
- `npm test` — pendiente (sin infraestructura de tests).

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

- `PORT` (default 5000)
- `MONGO_URI`
- `JWT_SECRET` (requerido)
- `JWT_EXPIRES_IN` (default 7d)
- `FRONTEND_ORIGIN` (coma-separado, default http://localhost:5173)
- `NODE_ENV` (development/production)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Rutas principales

- `POST /api/usuarios/login` — login (publico)
- `GET /api/usuarios` — listado paginado (auth)
- `POST /api/usuarios` — crear usuario + perfil (rol admin)
- `GET /api/usuarios/me` — perfil del usuario autenticado
- `GET /api/instituciones`, `/api/departamentos`, `/api/municipios`
- `GET /api/roles` (publico), escrituras protegidas

## Respuestas

Envelope estandar:

- Exito: `{ data, pagination? }`
- Error: `{ error: { code, message } }`

## Migracion (dev)

Al cambiar `municipio.id_departamento` a ObjectId, re-sembrar la coleccion `municipios` (drop) o ejecutar migracion. Los seeds se ejecutan al iniciar si la coleccion esta vacia.

## Documentacion

Swagger disponible en `/api-docs`.
