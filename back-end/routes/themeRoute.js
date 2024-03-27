const express = require('express');
const theme_route = express();
const bodyParser = require('body-parser');
theme_route.use(bodyParser.json());
theme_route.use(bodyParser.urlencoded({ extended: true })); 

const themeController = require('../controllers/themeController');

theme_route.get('/get-theme/:id', themeController.getTheme);
theme_route.get('/get-themes', themeController.getThemes);
theme_route.get('/get-games-per-theme/:id', themeController.getGamesPerTheme);
theme_route.post('/create-theme',themeController.createTheme)
theme_route.put('/update-theme/:id',themeController.updateTheme)
theme_route.delete('/delete-theme/:id', themeController.deleteTheme);

module.exports = theme_route;  