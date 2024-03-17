const express = require('express');
const judge_route = express();

const bodyParser = require('body-parser');
judge_route.use(bodyParser.json());
judge_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const judgeController = require('../controllers/judgeController');

judge_route.post('/create-judge', upload.single('image'), judgeController.registerJudge);
judge_route.put('/update-judge-site/:id', judgeController.updateJudgeSite);
judge_route.get('/get-judges-per-site/:siteId', judgeController.getJudgesPerSite);

module.exports = judge_route;