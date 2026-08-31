const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    throw error;
  }
};

module.exports = conectarDB;