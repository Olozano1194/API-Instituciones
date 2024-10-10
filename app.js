if (require.main === module) {
    //valida si el archivo es el principal para no cargar las variables de entorno en vercel
    require('dotenv').config();
        
}

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
//const disconnectDB = require('./config/db');
const swaggerDocs = require('./config/swagger');
const cors = require('cors'); 

dotenv.config();
const app = express();

// Conectar a la base de datos
await connectDB();

//Habilitar Cors
app.use(cors({
    origin: ['https://instituciones-v1.vercel.app', 'http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para analizar JSON
app.use(express.json());

//ruta para la raiz
app.get('/', (req, res) => {
    res.send('API de Instituciones está funcionando correctamente');
});

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
const institucionRoutes = require('./routes/institucionRoutes');
app.use('/api/instituciones', institucionRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Algo salió mal!', error: err.message });
});

// Iniciar Swagger en el puerto 5000
swaggerDocs(app);

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

