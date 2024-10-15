
// Importar módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const roomateRoutes = require('./routers/roommateRoutes')
const gastosRoutes = require('./routers/gastosRouters');

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Rutas para roommates
app.use('/roommate',roomateRoutes); //Ruta POST
app.use('/roommates',roomateRoutes); //Ruta GET
app.use('/gastos',gastosRoutes); //Ruta de gastos


app.listen(PORT, () => {
    console.log(`Servidor corriendo 👋😍 en el http://localhost:${PORT}`);
});