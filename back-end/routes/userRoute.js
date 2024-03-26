const express = require('express');
const user_route = express();

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const userController = require('../controllers/userController');

user_route.post('/register-user', upload.none(), userController.registerUser);
user_route.post('/login-user', upload.none(), userController.loginUser);
user_route.get('/magic-link/:token', userController.magicLink);
user_route.put('/assign-rol-user', upload.none(), userController.assignRol)
user_route.put('/update-user-site/:id', userController.updateSite);
user_route.get('/get-judges-per-site/:siteId', userController.getJudgesPerSite);
user_route.get('/get-local-per-site/:siteId', userController.getLocalOrganizersPerSite);
module.exports = user_route;