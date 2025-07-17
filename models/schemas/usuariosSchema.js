/**
 * @swagger
 * components:
 *   schemas:
 *     Institucion:
 *       type: object
 *       required:
 *         - name *         
 *         - email
 *         - password
 *         - idrole
 *         - idinstitucion
 *       properties:
 *         name:
 *           type: string
 *           description: El nombre del usuario *         
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *         password:
 *           type: string
 *           description: La contraseña del usuario
 *         idrole:
 *           type: integer
 *           description: El rol del usuario
 *         idinstitucion:
 *           type: integer
 *           description: La institucion del usuario *         
 *       example:
 *         name: "Institución Educativa La Esperanza" *
 *         email: "contacto@institucion.edu.co"
 *         password: "passw@rd123"
 *         idrol: 5
 *         idinstitucion: 102 *         
 */

module.exports = {
    Institucion: {
        type: "object",
        properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "integer" },
            rol: { type: "integer" },
            idinstitucion: { type: "integer" },            
        },
    },
};