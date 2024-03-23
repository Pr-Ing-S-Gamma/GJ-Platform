const express = require('express');
const user_route = express();

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const userController = require('../controllers/userController');

user_route.post('/login', upload.none(), userController.loginUser);
user_route.get('/magic-link/:token', userController.magicLink);
user_route.post('/verify-code', upload.none(), userController.verifyMagicLink);
user_route.put('/rol', upload.none(), userController.assignRol)

module.exports = user_route;