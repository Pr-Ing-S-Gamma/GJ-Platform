const express = require('express');
const jammer_route = express();

const bodyParser = require('body-parser');
jammer_route.use(bodyParser.json());
jammer_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const jammerController = require('../controllers/jammerController');

jammer_route.post('/register-jammer', upload.single('image'), jammerController.registerJammer);

module.exports = jammer_route;