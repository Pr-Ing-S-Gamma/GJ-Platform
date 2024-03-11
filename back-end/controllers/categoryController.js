const Category = require('../models/categoryModel');
const GlobalOrganizer = require('../models/globalOrganizerModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const existingCategory = await Category.findOne({ name: name });
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await GlobalOrganizer.findById(userId);
        
        if (existingCategory) {
            return res.status(400).json({ success: false, error: "Esa categoría ya existe" });
        }

        const category = new Category({
            name: name,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await category.save();

        res.status(200).json({ success: true, msg: 'Se ha creado correctamente la categoría' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await GlobalOrganizer.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de categoría proporcionado no es válido.' });
        } else {
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                return res.status(400).json({ success: false, error: "Esa categoría no existe" });
            }
        }
        if (req.body.name) {
            updateFields.name = req.body.name;
            updateFields.lastUpdateUser = {
                userId: lastUpdateUser._id,
                name: lastUpdateUser.name,
                email: lastUpdateUser.email
            }
            updateFields.lastUpdateDate = new Date()
        }

        await Category.findByIdAndUpdate({ _id: id }, updateFields);

        res.status(200).send({ success: true, msg: 'Se ha actualizado la categoría correctamente'});
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getCategory = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de categoría proporcionado no es válido.' });
        } else {
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                return res.status(400).json({ success: false, error: "Esa categoría no existe" });
            }
        }
        const selectedCategory = await Category.findById(id);
        res.status(200).send({ success:true, msg:'Categoría encontrada correctamente', data: selectedCategory });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getCategories = async(req,res)=>{
    try{
        const allCategories = await Category.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado categorías en el sistema', data: allCategories });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteCategory = async(req,res)=>{
    try{
        const id = req.params.id;
        const deletedCategory = await Category.findOneAndDelete({ _id: id });
        res.status(200).send({ success:true, msg:'Categoría eliminada correctamente', data: deletedCategory });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

module.exports = {
    createCategory,
    updateCategory,
    getCategory,
    getCategories,
    deleteCategory
};