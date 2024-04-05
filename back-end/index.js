// Importar los módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const path = require('path');
const hostname = '0.0.0.0'; // Cambio necesario: Escucha en todas las interfaces de red

// Crear una instancia de la aplicación Express
const app = express();
const appFrontend = express();
const portFrontend = 4200; // Puerto para el frontend

// Servir los archivos estáticos del frontend
appFrontend.use(express.static(path.join(__dirname, '../Frontend/GJ-Platform/dist/gj-platform/browser')));

// Manejar todas las rutas del frontend devolviendo el archivo index.html
appFrontend.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../Frontend/GJ-Platform/dist/gj-platform/browser/index.html'));
 });

// Iniciar el servidor del frontend
appFrontend.listen(portFrontend, () => {
    console.log(`Servidor del frontend escuchando en http://localhost:${portFrontend}`);
});

const port = 3000; // Establecer el puerto en el que el servidor escuchará las solicitudes

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/GameJamDB");

// Configuración de CORS - Permite solicitudes desde un origen específico
app.use(cors({
    origin: ['http://localhost:4200',  'http://149.130.176.112:4200'], 
    methods: ["GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware para analizar solicitudes JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Definir las rutas de la API para diferentes recursos

// Rutas de usuarios
const user_route = require('./routes/userRoute');
app.use('/api/user', user_route);

// Rutas de regiones
const region_route = require('./routes/regionRoute');
app.use('/api/region', region_route);

// Rutas de premios
const prize_route = require('./routes/prizeRoute');
app.use('/api/prize', prize_route);

// Rutas de sites
const site_route = require('./routes/siteRoute');
app.use('/api/site', site_route);

// Rutas de categorías
const category_route = require('./routes/categoryRoute');
app.use('/api/category', category_route);

// Rutas de GameJams
const game_jam_route = require('./routes/gameJamRoute');
app.use('/api/game-jam', game_jam_route);

// Rutas de fases
const stage_route = require('./routes/stageRoute');
app.use('/api/stage', stage_route);

// Rutas de equipos
const team_route = require('./routes/teamRoute');
app.use('/api/team', team_route);

// Rutas de entregables
const submission_route = require('./routes/submissionRoute');
app.use('/api/submission', submission_route);

// Rutas de temas
const theme_route = require('./routes/themeRoute');
app.use('/api/theme', theme_route);

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, hostname, () => {
    console.log(`Servidor escuchando en http://${hostname}:${port}`);
});
