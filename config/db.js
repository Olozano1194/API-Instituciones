const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        console.log('Intentando conectar a MongoDB...');
        console.log(`MONGO_URI: ${process.env.MONGO_URI}`);        
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a la base de datos MongoDB');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        process.exit(1); 
    }
};

module.exports = connectDB;
