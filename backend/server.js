require('dotenv').config();

const app = require('./src/app');
const conectarDB = require('./src/config/database');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '127.0.0.1';

const iniciarServidor = async () => {
  try {
    await conectarDB();

    const servidor = app.listen(PORT, HOST, () => {
      console.log(`Servidor activo en http://${HOST}:${PORT}`);
      console.log('Servidor escuchando:', servidor.listening);
    });

    servidor.on('error', (error) => {
      console.error('Error HTTP:', error.message);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

iniciarServidor();