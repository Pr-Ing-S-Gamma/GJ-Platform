const express = require('express');
const game_jam_route = express();

const bodyParser = require('body-parser');
const multer = require('multer');

const gameJamController = require('../controllers/gameJamController');

// Configuración de Multer para limitar el tamaño del archivo a 10 MB
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 2048 * 2048 } // 10 MB
});

game_jam_route.use(bodyParser.json());
game_jam_route.use(bodyParser.urlencoded({ extended: true }));

game_jam_route.post('/create-game-jam', upload.array('themes', 5), gameJamController.createGameJam);
game_jam_route.put('/update-game-jam/:id', upload.array('themes', 5), gameJamController.updateGameJam);
game_jam_route.get('/get-current-game-jam', gameJamController.getCurrentGameJam);
game_jam_route.get('/get-eval-game-jam', gameJamController.getGameJamToEvaluate);
game_jam_route.get('/get-game-jam/:id', gameJamController.getGameJam);
game_jam_route.get('/get-game-jams', gameJamController.getGameJams);
game_jam_route.get('/get-time-left', gameJamController.getTimeRemaining);
game_jam_route.get('/get-time-left-evaluator', gameJamController.getTimeRemainingEvaluation);
game_jam_route.delete('/delete-game-jam/:id', gameJamController.deleteGameJam);

module.exports = game_jam_route;
