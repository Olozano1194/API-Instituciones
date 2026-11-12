const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const cors = require('cors');
const initRoles = require('./middleware/initRoles');
const getDepartamentos = require('./middleware/initDepartamento');
const getMunicipio = require('./middleware/initMunicipio');

dotenv.config();
const app = express();

// Conectar a la base de datos
// connectDB();

// Middleware para analizar JSON
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// CORS configurado por entorno (FRONTEND_ORIGIN admite lista separada por comas)
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept']
}));

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
//Rutas para los roles
const rolRoutes = require('./routes/rolRoutes');
app.use('/api/roles', rolRoutes);
// Rutas para los estudiantes
const estudianteRoutes = require('./routes/estudianteRoutes');
app.use('/api/estudiantes', estudianteRoutes);
// Rutas para los profesores
const profesorRoutes = require('./routes/profesorRoutes');
app.use('/api/profesores', profesorRoutes);
// Rutas para los administradores
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/administradores', adminRoutes);


// Documentación Swagger / OpenAPI
const setupSwagger = require('./config/swagger');
setupSwagger(app);

const errorHandler = require('./middleware/errorHandler');

// Middleware para manejar errores (debe ir al final)
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        // Inicializar datos base de forma secuencial (roles, departamentos, municipios)
        await initRoles();
        await getDepartamentos();
        await getMunicipio();

        // Definir puerto
        if (process.env.VERCEL) {
            // Exporta la aplicación para su uso en otros modulos
            module.exports = app; // permite que vercel ejecute el servidor
        } else {
            // Iniciar el servidor localmente
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => {
                console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    };
};
startServer();