const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');
dotenv.config();

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        logger.info('Conectado a la base de datos MongoDB');
        return connection;
    } catch (error) {
        logger.error(error, 'Error al conectar a la base de datos');
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info('Desconectado de la base de datos');
    } catch (error) {
        logger.error(error, 'Error al desconectar de la base de datos');
    }
};

module.exports = { connectDB, disconnectDB };