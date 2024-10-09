if (require.main === module) {
    //valida si el archivo es el principal para no cargar las variables de entorno en vercel
    require('dotenv').config();
        
}

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../api-instituciones/config/db');
const swaggerDocs = require('../api-instituciones/config/swagger');
const cors = require('cors'); 

dotenv.config();
const app = express();

// Conectar a la base de datos
connectDB();

//Habilitar Cors
app.use(cors({
    origin: ['https://instituciones-v1.vercel.app', 'http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para analizar JSON
app.use(express.json());



// Definir rutas
const institucionRoutes = require('../api-instituciones/routes/institucionRoutes');
app.use('/api/instituciones', institucionRoutes);

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

