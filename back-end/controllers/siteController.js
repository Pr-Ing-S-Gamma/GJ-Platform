const User = require('../models/userModel');
const Site = require('../models/siteModel');
const Region = require('../models/regionModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const createSite = async (req, res) => {
    const { name, regionId, countryName } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({ success: false, error: 'El ID de región proporcionado no es válido.' });
        } else {
            const existingRegion = await Region.findById(regionId);
            if (!existingRegion) {
                return res.status(400).json({ success: false, error: "Esa región no existe" });
            }
        }

        const countriesPath = path.join(__dirname, '..', 'staticData', 'countries.json');
        const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));

        const country = countriesData.find(country => country.name === countryName);

        if (!country) {
            return res.status(400).json({ success: false, error: "El país proporcionado no es válido" });
        }

        const site = new Site({
            name: name,
            country: {
                name: countryName,
                code: country.code 
            },
            region: regionId,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await site.save();

        res.status(200).json({ success: true, msg: 'Se ha creado correctamente el site' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateSite = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        const regionId = req.body.regionId;
        const countryName = req.body.countryName;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de site proporcionado no es válido.' });
        } else {
            const existingRegion = await Site.findById(id);
            if (!existingRegion) {
                return res.status(400).json({ success: false, error: "Ese site no existe" });
            }
        }
        let changed = 0;
        if (req.body.name) {
            updateFields.name = req.body.name;
            changed++;
        }
        if (req.body.countryName) {
            const countriesPath = path.join(__dirname, '..', 'staticData', 'countries.json');
            const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
    
            const country = countriesData.find(country => country.name === countryName);
    
            if (!country) {
                return res.status(400).json({ success: false, error: "El país proporcionado no es válido" });
            }
            updateFields.country = {
                name: countryName,
                code: country.code 
            }
            changed++;
        }

        if (regionId) {
            if (!mongoose.Types.ObjectId.isValid(regionId)) {
                return res.status(400).json({ success: false, error: 'El ID de región proporcionado no es válido.' });
            } else {
                const existingRegion = await Region.findById(regionId);
                if (!existingRegion) {
                    return res.status(400).json({ success: false, error: "Esa región no existe" });
                }
            }
            updateFields.region = regionId;
            changed++;
        }

        if (changed > 0) {
            updateFields.lastUpdateUser = {
                userId: lastUpdateUser._id,
                name: lastUpdateUser.name,
                email: lastUpdateUser.email
            };
            updateFields.lastUpdateDate = new Date();
        }

        await Site.findByIdAndUpdate({ _id: id }, updateFields);

        res.status(200).send({ success: true, msg: 'Se ha actualizado el site correctamente'});
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getSite = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de site proporcionado no es válido.' });
        } else {
            const existingRegion = await Site.findById(id);
            if (!existingRegion) {
                return res.status(400).json({ success: false, error: "Ese site no existe" });
            }
        }
        const selectedSite = await Site.findById(id);
        res.status(200).send({ success:true, msg:'Site encontrado correctamente', data: selectedSite });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getSites = async(req,res)=>{
    try{
        const allSites = await Site.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado sites en el sistema', data: allSites });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteSite = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de site proporcionado no es válido.' });
        } else {
            const existingRegion = await Site.findById(id);
            if (!existingRegion) {
                return res.status(400).json({ success: false, error: "Ese site no existe" });
            }
        }
        const deletedSite = await Site.findOneAndDelete({ _id: id });
        res.status(200).send({ success:true, msg:'Site eliminado correctamente', data: deletedSite });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

module.exports = {
    createSite,
    updateSite,
    getSite,
    getSites,
    deleteSite
};