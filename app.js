const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const initRoles = require('./config/initRoles');

dotenv.config();
const app = express();

// Conectar a la base de datos
// connectDB();

// Middleware para analizar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Habilitar Cors
app.use(cors());
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    res.sendStatus(200);
});

app.use((req, res, next) => {
    console.log('\n--- Nueva Petición ---');
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    if (req.method !== 'OPTIONS') {
        console.log('Body:', req.body);
    }
    next();
});

//Middleware para todas las rutas
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    next();
});

//Middleware de logging
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

// app.use('/api/instituciones', (req, res, next) => {
//     // Log de la solicitud para depuración
//     console.log(`${req.method} ${req.url}`);
//     next();
// });

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
app.use('/api/usuario', usuarioRoutes);
//Rutas para los roles
const rolRoutes = require('./routes/rolRoutes');
app.use('/api/roles', rolRoutes);

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

const startServer = async () => {
    try {
        //Middleware para conectar a la base de datos antes de cualquier operación
        // app.use(async (req, res, next) => {
        //     try {
        //         await connectDB();
        //         next();        
        //     } catch (error) {
        //         console.error('Error de conección a la base de datos:', error);
        //         res.status(500).json({ message: 'Error de conección a la base de datos' });        
        //     }
            
        // });
        await connectDB();
        // Esperamos un momento para asegurar que la base de datos esté lista
        setTimeout(async () => {
            await initRoles();
        }, 2000)

        // Definir puerto
        if (process.env.VERCEL) {
            //Exporta la aplicación para su uso en otros modulos
            module.exports =app;//permite que vercel ejecute el servidor
        }else {
            //iniciar el servidor localmente
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, async () =>{
                await initRoles(); 
                console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
            });
        };
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    };
};
startServer();