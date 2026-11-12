/**
 * @swagger
 * components:
 *   schemas:
 *     Usuarios:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - rol
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único del usuario (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico único del usuario
 *           example: "contacto@institucion.edu.co"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Contraseña del usuario (mínimo 8 caracteres)
 *         rol:
 *           type: string
 *           description: Identificador del rol asignado (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0a2"
 *         idinstitucion:
 *           type: string
 *           nullable: true
 *           description: Identificador de la institución a la que pertenece (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0f3"
 *         fotoPerfil:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "/uploads/avatar-123.jpg"
 *             publicId:
 *               type: string
 *               example: "avatar-123.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     LoginBody:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "admin@institucion.edu.co"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *           example: "passw@rd123"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Inicio de sesión exitoso"
 *             token:
 *               type: string
 *               description: Token JWT para autenticación Bearer
 *               example: "eyJhbGciOiJIUzI1NiIsIn..."
 *             user:
 *               type: object
 *               properties:
 *                 rol:
 *                   type: string
 *                   example: "admin"
 *
 *     CreateUsuarioBody:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - rol
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "docente@institucion.edu.co"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Contraseña (mínimo 8 caracteres)
 *           example: "Segura123*"
 *         rol:
 *           type: string
 *           description: ObjectId del rol (admin, docente o estudiante)
 *           example: "64f1a2b3c4d5e6f7a8b9c0a2"
 *         nombre:
 *           type: string
 *           description: Nombre para el perfil correspondiente
 *           example: "Carlos"
 *         apellido:
 *           type: string
 *           description: Apellido para el perfil correspondiente
 *           example: "Pérez"
 *         fechanacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento (solo perfil estudiante)
 *           example: "2005-04-12"
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *           example: "+57 300 123 4567"
 *         direccion:
 *           type: string
 *           description: Dirección de residencia (perfil estudiante)
 *           example: "Calle 10 # 20-30"
 *         especialidad:
 *           type: string
 *           description: Especialidad o área de enseñanza (perfil docente)
 *           example: "Matemáticas"
 *         cargo:
 *           type: string
 *           description: Cargo administrativo (perfil administrador)
 *           example: "Coordinador Académico"
 *
 *     UsuarioResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 email:
 *                   type: string
 *                   example: "admin@institucion.edu.co"
 *                 rol:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                 fotoPerfil:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     publicId:
 *                       type: string
 *             profile:
 *               type: object
 *               nullable: true
 *               description: Datos del perfil asociado según el rol
 *
 *     PaginatedUsuarios:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               email:
 *                 type: string
 *               rol:
 *                 type: string
 *               idinstitucion:
 *                 type: string
 *                 nullable: true
 *               perfil:
 *                 type: object
 *                 nullable: true
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */
