const express = require('express');
const chat_route = express();

const bodyParser = require('body-parser');
chat_route.use(bodyParser.json());
chat_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const chatController = require('../controllers/chatController');

chat_route.post('/create-chat', upload.none(), chatController.createChat);


module.exports = chat_route;