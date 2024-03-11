const express = require('express');
const global_organizer_route = express();

const bodyParser = require('body-parser');
global_organizer_route.use(bodyParser.json());
global_organizer_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const globalOrganizerController = require('../controllers/globalOrganizerController');

global_organizer_route.post('/register-global-organizer', upload.single('image'), globalOrganizerController.registerGlobalOrganizer);

module.exports = global_organizer_route;