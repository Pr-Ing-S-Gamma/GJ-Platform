const GameJam = require('../models/gameJamEventModel');
const User = require('../models/userModel');
const Site = require('../models/siteModel');
const Region = require('../models/regionModel');
const Stage = require('../models/stageModel');
const Team = require('../models/teamModel');
const Theme = require("../models/themeModel");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createGameJam = async (req, res) => {
    const { edition, region, site, theme } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);

        if (!mongoose.Types.ObjectId.isValid(region._id)) {
            return res.status(400).json({ success: false, error: 'The provided region ID is not valid.' });
        } else {
            const existingRegion = await Region.findById(region._id);
            if (!existingRegion) {
                return res.status(404).json({ success: false, error: "That region does not exist." });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(site._id)) {
            return res.status(400).json({ success: false, error: 'The provided site ID is not valid.' });
        } else {
            const existingSite = await Site.findById(site._id);
            if (!existingSite) {
                return res.status(404).json({ success: false, error: "That site does not exist." });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(theme._id)) {
            return res.status(400).json({ success: false, error: 'The provided theme ID is not valid.' });
        } else {
            const existingTheme = await Theme.findById(theme._id);
            if (!existingTheme) {
                return res.status(404).json({ success: false, error: "That theme does not exist." });
            }
        }

        const gameJam = new GameJam({
            edition: edition,
            region: {
                _id: region._id,
                name: region.name
            },
            site: {
                _id: site._id,
                name: site.name
            },
            theme: {
                _id: theme._id,
                titleEN: theme.titleEN,
                descriptionEN: theme.descriptionEN,
                manualEN: theme.manualEN
            },
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await gameJam.save();

        res.status(200).json({ success: true, msg: 'GameJam created successfully.', gameJamId: gameJam._id});
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateGameJam = async (req, res) => {
    const { id } = req.params;
    const { edition, region, site, theme } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'The provided ID is not valid.' });
        }

        let gameJam = await GameJam.findById(id);
        
        if (!gameJam) {
            return res.status(404).json({ success: false, error: 'GameJam not found.' });
        }

        if (edition) {
            gameJam.edition = edition;
            const query = { 'gameJam._id': id };

            const updateFieldsQuery = { $set: { 'gameJam.edition': edition } };

            const updatePromises = [];

            updatePromises.push(
              Stage.updateMany(query, updateFieldsQuery),
              Team.updateMany(query, updateFieldsQuery)
            );
            
            Promise.all(updatePromises)
            .then(results => {
              results.forEach((result, index) => {
                const modelNames = ['Stage', 'Team'];
                console.log(`${modelNames[index]} documents updated successfully:`, result);
              });
            })
            .catch(error => {
              console.error('Error updating documents:', error);
            });
        }
        if (region) {
            if (region._id && mongoose.Types.ObjectId.isValid(region._id)) {
                const existingRegion = await Region.findById(region._id);
                if (!existingRegion) {
                    return res.status(404).json({ success: false, error: "That region does not exist." });
                }
                gameJam.region = {
                    _id: region._id,
                    name: region.name
                };
            } else {
                return res.status(400).json({ success: false, error: 'Invalid region ID provided.' });
            }
        }
        if (site) {
            if (site._id && mongoose.Types.ObjectId.isValid(site._id)) {
                const existingSite = await Site.findById(site._id);
                if (!existingSite) {
                    return res.status(404).json({ success: false, error: "That site does not exist." });
                }
                gameJam.site = {
                    _id: site._id,
                    name: site.name
                };
            } else {
                return res.status(400).json({ success: false, error: 'Invalid site ID provided.' });
            }
        }

        if (theme) {
            if (theme._id && mongoose.Types.ObjectId.isValid(theme._id)) {
                const existingTheme = await Theme.findById(theme._id);
                if (!existingTheme) {
                    return res.status(404).json({ success: false, error: "That theme does not exist." });
                }
                gameJam.theme = {
                    _id: theme._id,
                    titleEN: theme.titleEN,
                    descriptionEN: theme.descriptionEN,
                    manualEN: theme.manualEN
                };
            } else {
                return res.status(400).json({ success: false, error: 'Invalid theme ID provided.' });
            }
        }

        await gameJam.save();
        res.status(200).json({ success: true, msg: 'GameJam updated successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
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
                return res.status(404).json({ success: false, error: "Esa GameJam no existe" });
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
        const query = { 'gameJam._id': id };

        const deletePromises = [];
        
        deletePromises.push(
            Stage.deleteMany(query),
            Team.deleteMany(query)
        );
        
        Promise.all(deletePromises)
            .then(results => {
                results.forEach((result, index) => {
                    const modelNames = ['Stage', 'Team'];
                    console.log(`${modelNames[index]} documents deleted successfully:`, result);
                });
            })
            .catch(error => {
                console.error('Error deleting documents:', error);
            });        
        res.status(200).send({ success:true, msg:'GameJam deleted successfully', data: deletedGameJam });
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