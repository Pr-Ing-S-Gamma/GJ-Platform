const express = require('express');
const local_organizer_route = express();

const bodyParser = require('body-parser');
local_organizer_route.use(bodyParser.json());
local_organizer_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const localOrganizerController = require('../controllers/localOrganizerController');

local_organizer_route.post('/register-local-organizer', upload.single('image'), localOrganizerController.registerLocalOrganizer);

module.exports = local_organizer_route;