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
 *         - idinstitucion
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario 
 *         password:
 *           type: string
 *           description: La contraseña del usuario 
 *         rol:
 *           type: string
 *           default: "usuario"
 *           description: El rol del usuario
 *         idinstitucion:
 *           type: integer
 *           nullable: true
 *           description: La institucion del usuario         
 *       example:
 *         email: "contacto@institucion.edu.co"
 *         password: "passw@rd123"
 *         rol: 5
 *         idinstitucion: 102          
 */