/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre 
 *         - apellido         
 *         - email *
 *         - password *
 *         - idrole
 *         - idinstitucion
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del usuario        
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario *
 *         password:
 *           type: string
 *           description: La contraseña del usuario *
 *         rol:
 *           type: string
 *           default: "usuario"
 *           description: El rol del usuario
 *         idinstitucion:
 *           type: integer
 *           nullable: true
 *           description: La institucion del usuario *         
 *       example:
 *         name: "Institución Educativa La Esperanza" *
 *         email: "contacto@institucion.edu.co"
 *         password: "passw@rd123"
 *         idrol: 5
 *         idinstitucion: 102 *         
 */

// module.exports = {
//     Usuario: {
//         type: "object",
//         properties: {
//             nombre: { type: "string" },
//             apellido: { type: "string" },
//             email: { type: "string", format: "email" },
//             password: { type: "string" },
//             rol: { type: "string" },
//             idinstitucion: { type: "integer" },            
//         },
//     },
// };