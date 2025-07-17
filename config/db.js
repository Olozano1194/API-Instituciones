const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// let cachedDb = null;

const connectDB = async () => {
    // if (cachedDb) {
    //     console.log('Ya  tenemos una conexión a la base de datos');        
    //     return       
    // }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // bufferCommands: false,
            // serverSelectionTimeoutMS: 30000
        });
        // cachedDb = true;
        console.log('Conectado a la base de datos MongoDB');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        throw error;
        //process.exit(1); 
    }
};

const disconnectDB = async () => {
    await mongoose.disconnect().then(() => {
        console.log('Desconectado de la base de datos');
    }).catch((error) => {
        console.error('Error al desconectar de la base de datos', error);
    });

}
module.exports = disconnectDB;

module.exports = connectDB;
