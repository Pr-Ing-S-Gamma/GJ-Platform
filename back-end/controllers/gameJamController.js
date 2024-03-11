const GameJam = require('../models/gameJamEventModel');
const User = require('../models/userModel');
const Site = require('../models/siteModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createGameJam = async (req, res) => {
    const { edition, stages, siteId } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);

        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ success: false, error: 'El ID de site proporcionado no es válido.' });
        } else {
            const existingSite = await Site.findById(siteId);
            if (!existingSite) {
                return res.status(400).json({ success: false, error: "Ese site no existe" });
            }
        }

        const stageIds = [];

        for (const stageId of stages) {
            const stage = await Stage.findById(stageId);
            if (stage) {
                stageIds.push(stage._id);
            }
        }

        const gameJam = new GameJam({
            edition: edition,
            stages: stageIds, 
            site: siteId,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await gameJam.save();

        res.status(200).json({ success: true, msg: 'Se ha creado correctamente la GameJam' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateGameJam = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de GameJam proporcionado no es válido.' });
        } else {
            const existingGameJam = await GameJam.findById(id);
            if (!existingGameJam) {
                return res.status(400).json({ success: false, error: "Esa GameJam no existe" });
            }
        }
        if (req.body.edition) {
            updateFields.edition = req.body.edition;
            updateFields.lastUpdateUser = {
                userId: lastUpdateUser._id,
                name: lastUpdateUser.name,
                email: lastUpdateUser.email
            }
            updateFields.lastUpdateDate = new Date()
        }

        if (req.body.stages) {
            updateFields.stages = req.body.stages;
        }

        if (req.body.siteId) {
            const siteId = req.body.siteId;
            if (!mongoose.Types.ObjectId.isValid(siteId)) {
                return res.status(400).json({ success: false, error: 'El ID de site proporcionado no es válido.' });
            } else {
                const existingSite = await Site.findById(siteId);
                if (!existingSite) {
                    return res.status(400).json({ success: false, error: "Ese site no existe" });
                }
            }
            updateFields.site = siteId;
        }
        await GameJam.findByIdAndUpdate({ _id: id }, updateFields);

        res.status(200).send({ success: true, msg: 'Se ha actualizado la GameJam correctamente'});
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getGameJam = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de GameJam proporcionado no es válido.' });
        } else {
            const existingGameJam = await GameJam.findById(id);
            if (!existingGameJam) {
                return res.status(400).json({ success: false, error: "Esa GameJam no existe" });
            }
        }
        const selectedGameJam = await GameJam.findById(id);
        res.status(200).send({ success:true, msg:'GameJam encontrada correctamente', data: selectedGameJam });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getGameJams = async(req,res)=>{
    try{
        const allGameJams = await GameJam.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado GameJams en el sistema', data: allGameJams });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteGameJam = async(req,res)=>{
    try{
        const id = req.params.id;
        const deletedGameJam = await GameJam.findOneAndDelete({ _id: id });
        res.status(200).send({ success:true, msg:'GameJam eliminada correctamente', data: deletedGameJam });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

module.exports = {
    createGameJam,
    updateGameJam,
    getGameJam,
    getGameJams,
    deleteGameJam
};