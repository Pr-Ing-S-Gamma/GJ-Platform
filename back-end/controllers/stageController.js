const Stage = require('../models/stageModel');
const User = require('../models/userModel');
const GameJam = require('../models/gameJamEventModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createStage = async (req, res) => {
    const { name, startDate, endDate, gameJam } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        if (!gameJam || !gameJam._id || !mongoose.Types.ObjectId.isValid(gameJam._id)) {
            return res.status(400).json({ success: false, error: 'The provided GameJam is invalid.' });
        } else {
            const existingGameJam = await GameJam.findById(gameJam._id);
            if (!existingGameJam) {
                return res.status(400).json({ success: false, error: "That GameJam does not exist" });
            }

            const stage = new Stage({
                name: name,
                startDate: startDate,
                endDate: endDate,
                gameJam: {
                    _id: gameJam._id,
                    edition: gameJam.edition
                },
                creatorUser: {
                    userId: creatorUser._id,
                    name: creatorUser.name,
                    email: creatorUser.email
                },
                creationDate: new Date()
            });

            await stage.save();

            existingGameJam.stages.push(stage._id);
            await existingGameJam.save();

            res.status(200).json({ success: true, msg: 'Stage created successfully', stageId: stage._id });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateStage = async (req, res) => {
    const { id } = req.params;
    const { name, startDate, endDate, gameJam } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        const existingStage = await Stage.findById(id);
        if (!existingStage) {
            return res.status(404).json({ success: false, error: 'Stage not found' });
        }

        if (gameJam && gameJam._id && mongoose.Types.ObjectId.isValid(gameJam._id)) {
            const existingGameJam = await GameJam.findById(gameJam._id);
            if (!existingGameJam) {
                return res.status(400).json({ success: false, error: "The provided GameJam does not exist" });
            }
            existingStage.gameJam = {
                _id: gameJam._id,
                edition: gameJam.edition
            };
        }

        if (name) existingStage.name = name;
        if (startDate) existingStage.startDate = startDate;
        if (endDate) existingStage.endDate = endDate;
        existingStage.lastUpdateUser = {
            userId: lastUpdateUser._id,
            name: lastUpdateUser.name,
            email: lastUpdateUser.email
        };
        await existingStage.save();

        res.status(200).json({ success: true, msg: 'Stage updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};



const getStage = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de fase proporcionado no es válido.' });
        } else {
            const existingStage = await Stage.findById(id);
            if (!existingStage) {
                return res.status(400).json({ success: false, error: "Esa fase no existe" });
            }
        }
        const selectedStage = await Stage.findById(id);
        res.status(200).send({ success:true, msg:'Fase encontrada correctamente', data: selectedStage });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getStages = async(req,res)=>{
    try{
        const allStages = await Stage.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado fases en el sistema', data: allStages });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteStage = async (req, res) => {
    try {
        const id = req.params.id;
        
        const deletedStage = await Stage.findOneAndDelete({ _id: id });

        if (deletedStage) {
            await GameJam.updateOne({ _id: deletedStage.gameJam }, { $pull: { stages: deletedStage._id } });

            res.status(200).send({ success: true, msg: 'Fase eliminada correctamente', data: deletedStage });
        } else {
            res.status(404).json({ success: false, error: 'No se encontró la fase con el ID proporcionado' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

module.exports = {
    createStage,
    updateStage,
    getStage,
    getStages,
    deleteStage
};