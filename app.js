if (require.main === module) {
    //valida si el archivo es el principal para no cargar las variables de entorno en vercel
    require('dotenv').config();
}

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

dotenv.config();
const app = express();

// Conectar a la base de datos
// connectDB();

//Habilitar Cors
app.use(cors({
    origin: ['https://instituciones-v1.vercel.app', 'http://localhost:5001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para analizar JSON
app.use(express.json());

//Middleware para conectar a la base de datos antes de cualquier operación
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

//ruta para la raiz
// app.get('/', (req, res) => {
//     res.send('API de Instituciones está funcionando correctamente');
// });

//se hizo esta modificación para poder que funcionara la conexión de vercel con mongodb
// app.get('/connectdb', async (req, res) => {
//     await disconnectDB();
//     await connectDB();
//     res.send('Conectado a la base de datos');
// });

app.use('/api/instituciones', (req, res, next) => {
    // Log de la solicitud para depuración
    console.log(`${req.method} ${req.url}`);
    next();
});

// Definir rutas
//Ruta para las instituciones
const institucionRoutes = require('./routes/institucionRoutes');
app.use('/api/instituciones', institucionRoutes);
//Ruta para los departamentos
const departamentoRoutes = require('./routes/departamentoRoutes');
app.use('/api/departamentos', departamentoRoutes);
//Ruta para los municipios
const municipioRoutes = require('./routes/municipioRoutes');
app.use('/api/municipios', municipioRoutes);
//Rutas para los usuarios
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Algo salió mal!', error: err.message });
});

// Configuración de swagger-jsdoc
const swaggerOptions = {
    definition: {
        openapi: "3.0.0", 
        info: {
            title: "API de Instituciones Educativas",
            version: "1.0.0",
            description: "Documentación de la API para gestionar instituciones educativas",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
            },
        ],
    },
    apis: ["./routes/institucionRoutes.js", "./routes/departamentoRoutes.js", "./routes/municipioRoutes.js", "./routes/usuariosRoutes.js"],
};

// Iniciar Swagger en el puerto 5000
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Servir documentación Swagger en /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Definir puerto
if (process.env.VERCEL) {
    //Exporta la aplicación para su uso en otros modulos
    module.exports =app;//permite que vercel ejecute el servidor
}else {
    //iniciar el servidor localmente
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
}

//Exporta la aplicación para su uso en otros modulos
//module.exports = app;//permite que vercel ejecute el servidor

