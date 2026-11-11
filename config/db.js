const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a la base de datos MongoDB');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Desconectado de la base de datos');
    } catch (error) {
        console.error('Error al desconectar de la base de datos', error);
    }
};

module.exports = { connectDB, disconnectDB };