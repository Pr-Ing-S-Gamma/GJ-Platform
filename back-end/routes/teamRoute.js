const express = require('express');
const team_route = express();

const bodyParser = require('body-parser');
team_route.use(bodyParser.json());
team_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const teamController = require('../controllers/teamController');

team_route.post('/create-team', upload.none(), teamController.createTeam);
team_route.put('/update-team/:id', upload.none(), teamController.updateTeam);
team_route.get('/get-team/:id', teamController.getTeam);
team_route.get('/get-teams', teamController.getTeams);
team_route.delete('/delete-team/:id', teamController.deleteTeam);
team_route.get('/get-teams/:site', teamController.getTeamSite);

module.exports = team_route;