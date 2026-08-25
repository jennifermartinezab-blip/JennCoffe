require('dotenv').config();

const app = require('./src/app');
const conectarDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

conectarDB();

app.listen(PORT, () => {
  console.log(`Servidor JennCoffee ejecutándose en http://localhost:${PORT}`);
});