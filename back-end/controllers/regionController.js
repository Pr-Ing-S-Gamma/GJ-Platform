const Region = require('../models/regionModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createRegion = async (req, res) => {
    const { name } = req.body;
    try {
        const existingRegion = await Region.findOne({ name: name });
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        
        if (existingRegion) {
            return res.status(400).json({ success: false, error: "Esa región ya existe" });
        }

        const region = new Region({
            name: name,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await region.save();

        res.status(200).json({ success: true, msg: 'Se ha creado correctamente la región' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateRegion = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de región proporcionado no es válido.' });
        } else {
            const existingRegion = await Region.findById(id);
            if (!existingRegion) {
                return res.status(400).json({ success: false, error: "Esa región no existe" });
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

        await Region.findByIdAndUpdate({ _id: id }, updateFields);

        res.status(200).send({ success: true, msg: 'Se ha actualizado la región correctamente'});
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getRegion = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de región proporcionado no es válido.' });
        } else {
            const existingRegion = await Region.findById(id);
            if (!existingRegion) {
                return res.status(400).json({ success: false, error: "Esa región no existe" });
            }
        }
        const selectedRegion = await Region.findById(id);
        res.status(200).send({ success:true, msg:'Región encontrada correctamente', data: selectedRegion });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getRegions = async(req,res)=>{
    try{
        const allRegions = await Region.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado regiones en el sistema', data: allRegions });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteRegion = async(req,res)=>{
    try{
        const id = req.params.id;
        const deletedRegion = await Region.findOneAndDelete({ _id: id });
        res.status(200).send({ success:true, msg:'Región eliminada correctamente', data: deletedRegion });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

module.exports = {
    createRegion,
    updateRegion,
    getRegion,
    getRegions,
    deleteRegion
};