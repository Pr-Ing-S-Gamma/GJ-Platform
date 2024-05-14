const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Submission = require('../models/submissionModel')
const fs = require('fs');



const createCategoryy = async (req, res, next) => {

        const { titleSP, titleEN, titlePT, descriptionSP, descriptionEN, descriptionPT} = req.body;
        const { manualSP, manualEN, manualPT } = req.files;

        try {
            const existingCategory = await Category.findOne({ titleEN: titleEN });
            const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
            const creatorUser = await User.findById(userId);
            if (existingCategory) {
                return res.status(409).json({ success: false, error: "Category already exists" });
            }
            

            const category = new Category({
                titleSP: titleSP,
                titleEN: titleEN,
                titlePT: titlePT,
                descriptionSP: descriptionSP,
                descriptionEN: descriptionEN,
                descriptionPT: descriptionPT,
                manualSP: manualSP,
                manualEN: manualEN,
                manualPT: manualPT,
                creatorUser: {
                    userId: creatorUser._id,
                    name: creatorUser.name,
                    email: creatorUser.email
                },
                creationDate: new Date()
            });

            console.log(category.manualEN.data);

            await category.save();

            res.status(200).json({ success: true, msg: 'Category created successfully', categoryId: category._id });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
};


const createCategory = async (req, res) => {
    handlePDFs(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, msg: "error handle pdfsssss" });
        }


        const { titleSP, titleEN, titlePT, descriptionSP, descriptionEN, descriptionPT } = req.body;
        const { manualSP, manualEN, manualPT } = req.files;
        

        try {
            const manualSPBuffer = manualSP[0].buffer;
            const manualENBuffer = manualEN[0].buffer;
            const manualPTBuffer = manualPT[0].buffer;

        } catch (error) {
            res.status(400).json({ success: false, msg: "error pdf" });
        }

        try {
            const existingCategory = await Category.findOne({ titleEN: titleEN });
            const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
            const creatorUser = await User.findById(userId);
            if (existingCategory) {
                return res.status(409).json({ success: false, error: "Category already exists" });
            }

            const category = new Category({
                titleSP: titleSP,
                titleEN: titleEN,
                titlePT: titlePT,
                descriptionSP: descriptionSP,
                descriptionEN: descriptionEN,
                descriptionPT: descriptionPT,
                manualSP: manualSPBuffer,
                manualEN: manualENBuffer,
                manualPT: manualPTBuffer,
                creatorUser: {
                    userId: creatorUser._id,
                    name: creatorUser.name,
                    email: creatorUser.email
                },
                creationDate: new Date()
            });

            await category.save();

            res.status(200).json({ success: true, msg: 'Category created successfully', categoryId: category._id });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
};
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { titleSP, titleEN, titlePT, descriptionSP, descriptionEN, descriptionPT, manualSP, manualEN, manualPT } = req.body;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Provided category ID is not valid.' });
        } else {
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                return res.status(404).json({ success: false, error: "Category does not exist" });
            }
        }
        if (titleEN) {
            const existingCategory = await Category.findOne({ titleEN: titleEN });
            if (existingCategory) {
                return res.status(409).json({ success: false, error: "Category with this name already exists" });
            }

            updateFields.titleSP = titleSP;
            updateFields.titleEN = titleEN;
            updateFields.titlePT = titlePT;
            updateFields.descriptionSP = descriptionSP;
            updateFields.descriptionEN = descriptionEN;
            updateFields.descriptionPT = descriptionPT;
            updateFields.manualSP = manualSP;
            updateFields.manualEN = manualEN;
            updateFields.manualPT = manualPT;
            updateFields.lastUpdateUser = {
                userId: lastUpdateUser._id,
                name: lastUpdateUser.name,
                email: lastUpdateUser.email
            }
            updateFields.lastUpdateDate = new Date()
        }

        await Category.findByIdAndUpdate({ _id: id }, updateFields);

        res.status(200).send({ success: true, msg: 'Category updated successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de categoría proporcionado no es válido.' });
        } else {
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                return res.status(404).json({ success: false, error: "Esa categoría no existe" });
            }
        }
        const selectedCategory = await Category.findById(id);
        res.status(200).send({ success: true, msg: 'Categoría encontrada correctamente', data: selectedCategory });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({});
        res.status(200).send({ success: true, msg: 'Se han encontrado categorías en el sistema', data: allCategories });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedCategory = await Category.findOneAndDelete({ _id: id });
        res.status(200).send({ success: true, msg: 'Categoría eliminada correctamente', data: deletedCategory });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getGamesbyCategory = async (req, res) => {
    const catgoryID = req.params.id;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, error: "Category not found" });
        }
        const submissions = await Submission.find({ category: catgoryID })
            .populate('team')
            .populate('category')
            .populate('stage')
            .populate('game')
            .populate('theme')
        return res.status(200).json({ success: true, submissions: submissions });
    } catch (error) {
        res.status(400).json({ error: 'Error interno del servidor' });
    }
}

const getPDF = async (req, res) =>{
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).send('Categoría no encontrada');
        }

        const pdfData = category.manualSP; // Suponiendo que manualSP contiene los datos binarios del PDF
        const fileName = 'documento.pdf'; // Nombre del archivo

        // Opción 1: Enviar los datos binarios directamente al cliente
        //res.contentType('application/pdf').send(pdfData);

        // Opción 2: Crear un enlace de descarga
         fs.writeFileSync(fileName, pdfData); // Guarda el PDF localmente
        res.download(fileName); // Descarga el PDF al cliente

    } catch (error) {
        console.error('Error al obtener el PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
    
};

module.exports = {
    createCategory,
    updateCategory,
    getCategory,
    getCategories,
    deleteCategory,
    getGamesbyCategory,
    getPDF
};