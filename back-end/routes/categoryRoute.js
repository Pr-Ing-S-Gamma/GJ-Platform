const express = require('express');
const category_route = express();

const bodyParser = require('body-parser');
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

//const upload = multer({ dest: "../routes/uploads/" });

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const categoryController = require('../controllers/categoryController');

const handlePDFs = upload.fields([
    { name: 'manualSP', maxCount: 1 },
    { name: 'manualEN', maxCount: 1 },
    { name: 'manualPT', maxCount: 1 }
]);

const cpUpload = upload.fields([{ name: 'manualSP', maxCount: 1 }, { name: 'manualEN', maxCount: 1 }, {name: 'manualPT', maxCount: 1 }]);
category_route.post('/create-category', handlePDFs, categoryController.createCategory);
category_route.put('/update-category/:id', upload.none(), categoryController.updateCategory);
category_route.get('/get-category/:id', categoryController.getCategory);
category_route.get('/get-categories', categoryController.getCategories);
category_route.delete('/delete-category/:id', categoryController.deleteCategory);
category_route.get('/get-games-per-category/:id', categoryController.getGamesbyCategory);


category_route.get('/pdf/:id', categoryController.getPDF)





module.exports = category_route;