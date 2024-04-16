const express = require('express');
const submission_route = express();

const bodyParser = require('body-parser');
submission_route.use(bodyParser.json());
submission_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const submissionController = require('../controllers/submissionController');

submission_route.post('/create-submission', upload.none(), submissionController.createSubmission);
submission_route.post('/set-submission-score', upload.none(), submissionController.setSubmissionScore);
submission_route.put('/update-submission/:id', upload.none(), submissionController.updateSubmission);
submission_route.get('/get-submission/:id', submissionController.getSubmission);
submission_route.get('/get-submissions', submissionController.getSubmissions);
submission_route.delete('/delete-submission/:id', submissionController.deleteSubmission);
submission_route.put('/setEvaluatorToSubmission', submissionController.setEvaluatorToSubmission);

module.exports = submission_route;