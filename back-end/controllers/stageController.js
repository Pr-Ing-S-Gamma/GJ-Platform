const Stage = require('../models/stageModel');
const User = require('../models/userModel');
const GameJam = require('../models/gameJamEventModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createStage = async (req, res) => {
    const { name, startDate, endDate, gameJamId } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(gameJamId)) {
            return res.status(400).json({ success: false, error: 'El ID de GameJam proporcionado no es válido.' });
        } else {
            const existingGameJam = await GameJam.findById(gameJamId);
            if (!existingGameJam) {
                return res.status(400).json({ success: false, error: "Esa GameJam no existe" });
            }

            const stage = new Stage({
                name: name,
                startDate: startDate,
                endDate: endDate,
                gameJam: gameJamId,
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

            res.status(200).json({ success: true, msg: 'Se ha creado correctamente la fase' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateStage = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de fase proporcionado no es válido.' });
        } else {
            const existingStage = await Stage.findById(id);
            if (!existingStage) {
                return res.status(400).json({ success: false, error: "Esa fase no existe" });
            }
        }
        const existingStage = await Stage.findById(id);
        let changed = 0;
        if (req.body.name) {
            updateFields.name = req.body.name;
            changed++;
        }

        if (req.body.startDate) {
            updateFields.startDate = req.body.startDate;
            changed++;
        }

        if (req.body.endDate) {
            updateFields.endDate = req.body.endDate;
            changed++;
        }

        if (req.body.gameJamId) {
            if (!mongoose.Types.ObjectId.isValid(gameJamId)) {
                return res.status(400).json({ success: false, error: 'El ID de GameJam proporcionado no es válido.' });
            } else {
                const existingGameJam = await GameJam.findById(gameJamId);
                if (!existingGameJam) {
                    return res.status(400).json({ success: false, error: "Esa GameJam no existe" });
                }
            }
            await GameJam.updateOne(
                { _id: existingStage.gameJam },
                { $pull: { stages: existingStage._id } }
            );
            await GameJam.updateOne(
                { _id: req.body.gameJamId },
                { $addToSet: { stages: existingStage._id } }
            );

            updateFields.gameJam = req.body.gameJamId;
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

        await Stage.findByIdAndUpdate(id, updateFields);

        res.status(200).send({ success: true, msg: 'Se ha actualizado la fase correctamente'});
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