const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        return cachedDb;        
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = connection;
        console.log('Conectado a la base de datos MongoDB');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        process.exit(1); 
    }
};

module.exports = connectDB;
