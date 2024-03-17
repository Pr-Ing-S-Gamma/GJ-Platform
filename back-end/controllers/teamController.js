const Team = require('../models/teamModel');
const Jammer = require('../models/jammerModel');
const GameJam = require('../models/gameJamEventModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Site = require('../models/siteModel');
//const { all } = require('../routes/teamRoute');

const createTeam = async (req, res) => {
    //const { studioName, description, gameJamId, linkTree, jammers, submissions } = req.body;
    const { studioName, description, gameJamId, linkTree, jammers, siteName } = req.body;
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
        }

        const existingSite = await Site.find({name: siteName});
        if (!existingSite) {
            return res.status(400).json({ success: false, error: "Esa site no existe" });
        }
        

        const jammersId = [];
        for (const jammerId of jammers) {
            const jammer = await Jammer.findById(jammerId);
            if (jammer) {
                jammersId.push(jammer._id);
            }
        }

        /*
        const submissionsId = [];
        for (const submissionId of submissions) {
            const submission = await Submission.findById(submissionId);
            if (submission) {
                submissionsId.push(submission._id);
            }
        }*/

        const team = new Team({
            studioName: studioName,
            description: description,
            site: siteName,
            gameJam: gameJamId,
            linkTree: linkTree,
            logo: {
                name: req.file.originalname,
                type: req.file.mimetype,
                data: req.file.buffer
            },
            jammers: jammersId,
            //submissions: submissionsId,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await team.save();
        res.status(200).json({ success: true, msg: 'Se ha creado correctamente el equipo' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateTeam = async (req, res) => {
    try {
        const { studioName, description, gameJamId, linkTree, jammers } = req.body;
        const id = req.params.id; 
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        
        const existingTeam = await Team.findById(id);
        if (!existingTeam) {
            return res.status(400).json({ success: false, error: "Ese equipo no existe" });
        }

        let changed = 0;

        if (studioName) {
            updateFields.studioName = studioName;
            changed++;
        }

        if (description) {
            updateFields.description = description;
            changed++;
        }

        if (gameJamId) {
            if (!mongoose.Types.ObjectId.isValid(gameJamId)) {
                return res.status(400).json({ success: false, error: 'El ID de GameJam proporcionado no es válido.' });
            } else {
                const existingGameJam = await GameJam.findById(gameJamId);
                if (!existingGameJam) {
                    return res.status(400).json({ success: false, error: "Esa GameJam no existe" });
                }
            }
            updateFields.gameJam = gameJamId;
            changed++;
        }

        if (linkTree) {
            updateFields.linkTree = linkTree;
            changed++;
        }

        if (jammers && jammers.length > 0) {
            const jammersId = [];
            for (const jammerId of jammers) {
                const jammer = await Jammer.findById(jammerId);
                if (jammer) {
                    jammersId.push(jammer._id);
                }
            }
            updateFields.jammers = jammersId;
            changed++;
        }

        if (req.file) {
            updateFields.logo = {
                name: req.file.originalname,
                type: req.file.mimetype,
                data: req.file.buffer
            };
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

        await Team.findByIdAndUpdate(id, updateFields);

        res.status(200).send({ success: true, msg: 'Se ha actualizado el equipo correctamente'});
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getTeam = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de equipo proporcionado no es válido.' });
        } else {
            const existingTeam = await Team.findById(id);
            if (!existingTeam) {
                return res.status(400).json({ success: false, error: "Ese equipo no existe" });
            }
        }
        const selectedTeam = await Team.findById(id);
        res.status(200).send({ success:true, msg:'Fase encontrada correctamente', data: selectedTeam });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getTeams = async(req,res)=>{
    try{
        const allTeams = await Team.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado equipos en el sistema', data: allTeams });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const id = req.params.id;
        
        const deletedTeam = await Team.findOneAndDelete({ _id: id });

        if (deletedTeam) {

            res.status(200).send({ success: true, msg: 'Equipo eliminado correctamente', data: deletedTeam });
        } else {
            res.status(404).json({ success: false, error: 'No se encontró el equipo con el ID proporcionado' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getTeamSite = async (req, res)=>{
    try {
        const siteName = req.params.site;
        console.log(siteName)
        var teams = await Team.find({site: siteName});
        return res.status(200).send({success: true, msg: "Equipos econtrados para site "  + siteName, data: teams});
    } catch (error) {
        return res.status(400).send({success: false, msg: error.message});
    }
};

module.exports = {
    createTeam,
    updateTeam,
    getTeam,
    getTeams,
    deleteTeam,
    getTeamSite
};