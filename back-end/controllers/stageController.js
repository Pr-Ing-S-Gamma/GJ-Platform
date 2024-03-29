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
                return res.status(404).json({ success: false, error: "That GameJam does not exist" });
            }

            if (startDate && endDate) {
                const startDateObj = new Date(startDate);
                const endDateObj = new Date(endDate);
            
                if (startDateObj > endDateObj) {
                    res.status(403).json({ error: "Start date cannot be after end date." });
                    return;
                }
            } else {
                res.status(400).json({ error: "Start and end dates are required." });
                return;
            }

            const stage = new Stage({
                name: name,
                startDate: startDate,
                endDate: endDate,
                gameJam: {
                    _id: existingGameJam._id,
                    edition: existingGameJam.edition
                },
                creatorUser: {
                    userId: creatorUser._id,
                    name: creatorUser.name,
                    email: creatorUser.email
                },
                creationDate: new Date()
            });
            await stage.save();
            existingGameJam.stages.push({
                _id: stage._id,
                name: stage.name,
                startDate: stage.startDate,
                endDate: stage.endDate
            });

            await existingGameJam.save();

            res.status(200).json({ success: true, msg: 'Stage created successfully', stageId: stage._id });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateStage = async (req, res) => {
    const stageId = req.params.id;
    const { name, startDate, endDate, gameJam } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        if (!gameJam || !gameJam._id || !mongoose.Types.ObjectId.isValid(gameJam._id)) {
            return res.status(400).json({ success: false, error: 'The provided GameJam is invalid.' });
        } else {
            const stage = await Stage.findById(stageId);
            if (!stage) {
                return res.status(404).json({ success: false, error: "Stage not found." });
            }
            if (stage.gameJam._id.toString() !== gameJam._id.toString()) {
                const oldGameJam = await GameJam.findById(stage.gameJam._id);
                oldGameJam.stages = oldGameJam.stages.filter(s => s._id.toString() !== stageId);
                await oldGameJam.save();
                
                const newGameJam = await GameJam.findById(gameJam._id);
                newGameJam.stages.push({
                    _id: stage._id,
                    name: name,
                    startDate: startDate,
                    endDate: endDate
                });

                await newGameJam.save();

                stage.gameJam = {
                    _id: newGameJam._id,
                    edition: newGameJam.edition
                };
            } else {
                const currentGameJam = await GameJam.findById(gameJam._id);
                const stageIndex = currentGameJam.stages.findIndex(s => s._id.toString() === stageId);
                if (stageIndex !== -1) {
                    currentGameJam.stages[stageIndex].name = name;
                    currentGameJam.stages[stageIndex].startDate = startDate;
                    currentGameJam.stages[stageIndex].endDate = endDate;
                    await currentGameJam.save();
                }
            }
            if (startDate && endDate) {
                const startDateObj = new Date(startDate);
                const endDateObj = new Date(endDate);
            
                if (startDateObj > endDateObj) {
                    res.status(403).json({ error: "Start date cannot be after end date." });
                    return;
                }
            } else {
                res.status(400).json({ error: "Start and end dates are required." });
                return;
            }
            stage.name = name;
            stage.startDate = startDate;
            stage.endDate = endDate;
            stage.creationDate = new Date();
            stage.creatorUser = {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            };
            await stage.save();

            res.status(200).json({ success: true, msg: 'Stage updated successfully', stageId: stage._id });
        }
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
                return res.status(404).json({ success: false, error: "Esa fase no existe" });
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