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
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Start and end dates are required." });
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        const existingGameJam = await GameJam.findById(gameJam._id);
        if (!existingGameJam) {
            return res.status(404).json({ success: false, error: "That GameJam does not exist" });
        }

        const conflictingStage = existingGameJam.stages.find(stage => 
            (startDateObj >= stage.startDate && startDateObj <= stage.endDate) ||
            (endDateObj >= stage.startDate && endDateObj <= stage.endDate)
        );

        if (conflictingStage) {
            return res.status(403).json({ error: `There is already a stage within the specified time range. End date of the conflicting stage: ${conflictingStage.endDate}` });
        }

        const startDateCR = new Date(startDate);
        const endDateCR = new Date(endDate);
        startDateCR.setHours(startDateCR.getHours() - 6); 
        endDateCR.setHours(endDateCR.getHours() - 6); 

        const stage = new Stage({
            name: name,
            startDate: startDateCR,
            endDate: endDateCR,
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

            const existingGameJam = await GameJam.findById(gameJam._id);
            if (!existingGameJam) {
                return res.status(404).json({ success: false, error: "That GameJam does not exist" });
            }

            const conflictingStage = existingGameJam.stages.find(stage => 
                (startDate >= stage.startDate && startDate <= stage.endDate) ||
                (endDate >= stage.startDate && endDate <= stage.endDate)
            );

            if (conflictingStage && conflictingStage._id.toString() !== stageId) {
                return res.status(403).json({ error: `There is already a stage within the specified time range. End date of the conflicting stage: ${conflictingStage.endDate}` });
            }

            const startDateCR = new Date(startDate);
            const endDateCR = new Date(endDate);
            startDateCR.setHours(startDateCR.getHours() - 6); 
            endDateCR.setHours(endDateCR.getHours() - 6); 
            stage.name = name;
            stage.startDate = startDateCR;
            stage.endDate = endDateCR;
            stage.creationDate = new Date();
            stage.creatorUser = {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            };

            const otherStages = existingGameJam.stages.filter(s => s._id.toString() !== stageId);
            const newConflictingStage = otherStages.find(s => 
                (startDateCR >= s.startDate && startDateCR <= s.endDate) ||
                (endDateCR >= s.startDate && endDateCR <= s.endDate)
            );

            if (newConflictingStage) {
                return res.status(403).json({ error: `Updating this stage would cause conflicts with other stages. End date of the conflicting stage: ${newConflictingStage.endDate}` });
            }

            await stage.save();

            res.status(200).json({ success: true, msg: 'Stage updated successfully', stageId: stage._id });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getCurrentStage = async (req, res) => {
    try {
        const currentDate = new Date();

        const allGameJams = await GameJam.find({});

        for (const gameJam of allGameJams) {
            for (const stage of gameJam.stages) {
                if (currentDate >= stage.startDate && currentDate <= stage.endDate) {
                    res.status(200).send({ success: true, msg: 'Current Stage found', data: stage });
                    return;
                }
            }
        }

        res.status(404).send({ success: false, msg: 'No current Stage found' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
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

        const startDateUTC = new Date(selectedStage.startDate);
        const endDateUTC = new Date(selectedStage.endDate);
        startDateUTC.setHours(startDateUTC.getHours() + 6);
        endDateUTC.setHours(endDateUTC.getHours() + 6);

        res.status(200).send({ success:true, msg:'Fase encontrada correctamente', data: { ...selectedStage._doc, startDate: startDateUTC, endDate: endDateUTC } });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getStages = async(req,res)=>{
    try{
        const allStages = await Stage.find({});

        const stagesWithUTC = allStages.map(stage => {
            const startDateUTC = new Date(stage.startDate);
            const endDateUTC = new Date(stage.endDate);
            startDateUTC.setHours(startDateUTC.getHours() + 6); 
            endDateUTC.setHours(endDateUTC.getHours() + 6); 
            return { ...stage._doc, startDate: startDateUTC, endDate: endDateUTC };
        });

        res.status(200).send({ success:true, msg:'Se han encontrado fases en el sistema', data: stagesWithUTC });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteStage = async (req, res) => {
    try {
        const id = req.params.id;
        
        const deletedStage = await Stage.findOneAndDelete({ _id: id }).populate('gameJam');

        if (deletedStage) {
            console.log('Deleted Stage:', deletedStage);

            const gameJam = await GameJam.findOneAndUpdate(
                { _id: deletedStage.gameJam._id },
                { $pull: { stages: { _id: deletedStage._id.toString() } } },
                { new: true }
            );

            if (gameJam) {
                res.status(200).send({ success: true, msg: 'Stage deleted successfully', data: deletedStage });
            } else {
                res.status(404).json({ success: false, error: 'Associated GameJam not found' });
            }
        } else {
            res.status(404).json({ success: false, error: 'Stage not found with the provided ID' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ success: false, msg: error.message });
    }
};



module.exports = {
    createStage,
    updateStage,
    getCurrentStage,
    getStage,
    getStages,
    deleteStage
};