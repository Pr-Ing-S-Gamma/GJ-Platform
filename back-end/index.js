// Importar los módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();

// Crear una instancia de la aplicación Express
const app = express();
const port = 3000; // Establecer el puerto en el que el servidor escuchará las solicitudes

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/GameJamDB");

// Configuración de CORS - Permite solicitudes desde un origen específico
const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 204, // Devolver un código de éxito 204
    methods: "GET, POST, PUT, DELETE", // Permitir estos métodos HTTP
};
app.use(cors(corsOptions)); // Usar el middleware CORS

// Middleware para analizar solicitudes JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Definir las rutas de la API para diferentes recursos

// Rutas de usuarios
const user_route = require('./routes/userRoute');
app.use('/api/user', user_route);

// Rutas de jammers
const jammer_route = require('./routes/jammerRoute');
app.use('/api/jammer', jammer_route);

// Rutas de global organizers
const global_organizer_route = require('./routes/globalOrganizerRoute');
app.use('/api/global-organizer', global_organizer_route);

// Rutas de local organizers
const local_organizer_route = require('./routes/localOrganizerRoute');
app.use('/api/local-organizer', local_organizer_route);

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

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
