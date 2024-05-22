const User = require('../models/userModel');
const Team = require('../models/teamModel');
const Site = require('../models/siteModel');
const GameJam = require('../models/gameJamEventModel');
const { sendEmail } = require('../services/mailer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const { deepEqual } = require('assert');

const registerUser = async (req, res) => {
    const { name, email, region, site, team, rol, coins, discordUsername } = req.body;
    try {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(403).json({ success: false, error: 'Invalid email address.' });
        }
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(409).json({ success: false, error: "The email is already in use." });
        }

        const existingDiscordUsername = await User.findOne({ discordUsername });

        if (existingDiscordUsername) {
            return res.status(409).json({ success: false, error: "The Discord Username is already in use." });
        }

        const user = new User({
            name: name,
            email: email,
            region: { _id: region._id, name: region.name },
            site: { _id: site._id, name: site.name },
            team: team ? { _id: team._id, name: team.name } : null,
            rol: rol,
            coins: coins,
            discordUsername: discordUsername,
            creationDate: new Date()
        });

        await user.save();
        res.status(200).json({ success: true, msg: 'Registered successfully', userId: user._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, region, site, team, rol, coins, discordUsername } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID.' });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        if (email && email !== existingUser.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(403).json({ success: false, error: 'Invalid email address.' });
            }
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(409).json({ success: false, error: 'The email is already in use.' });
            }
            existingUser.email = email;
        }

        if (name) existingUser.name = name;
        if (region) existingUser.region = { _id: region._id, name: region.name };
        if (site) existingUser.site = { _id: site._id, name: site.name };
        if (team) existingUser.team = { _id: team._id, name: team.name };
        if (rol) existingUser.rol = rol;
        if (coins) existingUser.coins = coins;
        if (discordUsername) existingUser.discordUsername = discordUsername;
        if (rol === 'Jammer') {
            const query = { 'jammers._id': id };

            const updateFieldsQuery = {
                $set: {
                    'jammers.$.name': name,
                    'jammers.$.email': email
                }
            };

            Team.updateMany(query, updateFieldsQuery)
                .then(result => {
                    console.log("Jammer fields updated successfully:", result);
                })
                .catch(error => {
                    console.error('Error updating Jammer fields:', error);
                });
        }
        existingUser.lastUpdateDate = new Date();

        await existingUser.save();

        res.status(200).json({ success: true, msg: 'User updated successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const loginUser = async (req, res) => {
    const email = req.body.email;
    const existingUser = await User.findOne({ email });
    let rol;
    let userId;
    if (!existingUser) {
        const registerLink = `http://${process.env.PORT}:3000/register`;
        const subject = 'Login in GameJam Platform';
        const message = `Hi, click on this link to create an account:`;
        const link = registerLink;
        await sendEmail(email, subject, message, link);
        res.status(200).json({ success: true, msg: 'Se envió el registro al usuario.', email, registerLink });
    }

    rol = existingUser.rol;
    userId = existingUser._id;

    const token = jwt.sign({ userId, rol }, 'MY_JWT_SECRET', { expiresIn: 600000 });
    const magicLink = `http://${process.env.PORT}:3000/api/user/magic-link/${token}`;
    const subject = 'Login in GameJam Platform';
    const message = `Hi, click on this link to continue to the app:`;
    const link = magicLink;
    await sendEmail(email, subject, message, link);
    res.status(200).json({ success: true, msg: 'Se envió el magic link al usuario.', email, magicLink });
};

const magicLink = async (req, res) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, 'MY_JWT_SECRET');
        const userId = decodedToken.userId;
        const rol = decodedToken.rol;

        const newToken = jwt.sign({ userId, rol }, 'MY_JWT_SECRET');

        res.cookie('token', newToken, {
            httpOnly: false
        });
        let redirectUrl
        redirectUrl = `http://${process.env.PORT}:3000/home`;
        if (rol !== 'LocalOrganizer' && rol !== 'GlobalOrganizer' && rol !== 'Jammer' && rol !== 'Judge') {
            return res.clearCookie('token').redirect(`http://${process.env.PORT}:3000/login`);
        }
        return res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error al procesar el token:', error);
        res.status(400).json({ success: false, error: 'Error al procesar el token' });
    }
};

const logOutUser = async (req, res) => {
    try {
        res.clearCookie('token').status(200).json({ success: true, message: 'Cookie deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error deleting cookie' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User Not Found' });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(400).json({ success: false, error: 'Error al procesar el token' });
    }
};

const getLocalOrganizersPerSite = async (req, res) => {
    const { siteId } = req.params;
    try {
        var organizers = await User.find({ "site._id": siteId, rol: 'LocalOrganizer' });
        return res.status(200).send({ success: true, msg: "Organizadores econtrados para site ", data: organizers });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};

const updateSite = async (req, res) => {
    const { id } = req.params;
    const { siteId } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { site: siteId }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getStaffPerSite = async (req, res) => {
    const { region, site } = req.params;
    try {
        const staff = await User.find({ "region.name": region, "site.name": site })
        res.status(200).send({ success: true, msg: 'Staff have been found in the system.', data: staff });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.status(200).send({ success: true, msg: 'Se han encontrado usuarios en el sistema', data: allUsers });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getJammersPerSite = async (req, res) => {
    const { siteId } = req.params;
    try {
        const jammers = await User.find({ "site._id": siteId, rol: 'Jammer' })
        res.status(200).send({ success: true, msg: 'Users with the role "Jammer" have been found in the system.', data: jammers });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getJammersNotInTeamPerSite = async (req, res) => {
    const siteId = req.params.siteId;
    try {
        const jammersNotInTeam = await User.find({ "site._id": siteId, team: null, rol: 'Jammer' });
        res.status(200).send({ success: true, msg: 'Users with the role "Jammer" who are not in any team have been found in the system.', data: jammersNotInTeam });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findOneAndDelete({ _id: id });
        const query = { 'jammers._id': id };

        const updateFieldsQuery = {
            $pull: {
                'jammers': { '_id': id }
            }
        };

        Team.updateMany(query, updateFieldsQuery)
            .then(result => {
                console.log("Jammer removed successfully:", result);
            })
            .catch(error => {
                console.error('Error removing Jammer:', error);
            });

        res.status(200).send({ success: true, msg: 'Usuario eliminado correctamente', data: deletedUser });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const registerUsersFromCSV = async (req, res) => {
    try {
        if (!req.file || req.file.mimetype !== 'text/csv') {
            return res.status(400).json({ success: false, error: 'Please upload a CSV file.' });
        }

        const evaluatorId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(evaluatorId);
        const users = [];

        const fileData = req.file.buffer.toString('utf8');
        const lines = fileData.split('\n');
        lines.forEach(line => {
            const [name, email, rol, discordUsername, studioName] = line.split(',');
            users.push({ name, email, rol, discordUsername, studioName });
        });

        const registrationResults = [];
        const errorLog = [];
        const currentDate = new Date();

        const allGameJams = await GameJam.find({});
        const currentGameJam = allGameJams.find(gameJam => {
            return gameJam.stages.some(stage => {
                return currentDate >= stage.startDate && currentDate <= stage.endDate;
            });
        });

        if (!currentGameJam) {
            errorLog.push('No active game jam found');
            return res.status(200).json({ success: false, errorLog });
        }

        const site = await Site.findById(creatorUser.site._id);
        if (site.open === 1) {
            errorLog.push('Site is currently closed');
            return res.status(200).json({ success: false, errorLog });
        }

        for (const userData of users) {
            const { name, email, rol, discordUsername, studioName } = userData;
            const region = creatorUser.region;
            const site = creatorUser.site;

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errorLog.push(`Invalid email address for user: ${name} (${email}, ${discordUsername})`);
                continue;
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                errorLog.push(`The email is already in use for user: ${name} (${email}, ${discordUsername})`);
                continue;
            }

            const existingDiscordUsername = await User.findOne({ discordUsername });
            if (existingDiscordUsername) {
                errorLog.push(`The Discord Username is already in use for user: ${name} (${email}, ${discordUsername})`);
                continue;
            }

            let team = await Team.findOne({ studioName });
            if (!team) {
                team = new Team({
                    studioName,
                    description: 'Description...',
                    region: { _id: region._id, name: region.name },
                    site: { _id: site._id, name: site.name },
                    linkTree: [],
                    gameJam: { _id: currentGameJam._id, edition: currentGameJam.edition },
                    creatorUser: {
                        userId: creatorUser._id,
                        name: creatorUser.name,
                        email: creatorUser.email
                    },
                    creationDate: new Date(),
                    lastUpdateDate: new Date()
                });
                await team.save();
            } else if (team.site._id.toString() !== site._id.toString()) {
                errorLog.push(`The team is in a different site for user: ${name} (${email}, ${discordUsername})`);
                continue;
            }

            const jammer = await User.create({
                name,
                email,
                region: { _id: region._id, name: region.name },
                site: { _id: site._id, name: site.name },
                rol,
                coins: 0,
                discordUsername,
                creationDate: new Date()
            });

            if (team.region._id.toString() === region._id.toString()) {
                team.jammers.push({ _id: jammer._id, name, email, discordUsername });
                await team.save();
            }

            registrationResults.push(`Registered successfully for user: ${name} (${email}, ${discordUsername})`);
        }
        res.status(200).json({ success: true, msg: 'User registration completed.', registrationResults, errorLog });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const addRol = async (req, res) => {
    const userId = req.params.id;
    const {rol} = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no existe' });
        }
        if (user.roles.includes(rol)) {
            return res.status(400).json({ message: 'El usuario ya tiene este rol' });
        }
        user.roles.push(rol)
        await user.save();
        return res.status(200).json({ success: true, message: "Rol agregado" })
    }
    catch(error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteRol = async (req, res) => {
    const userId = req.params.id;
    const {rol} = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no existe' });
        }
        if (!user.roles.includes(rol)) {
            return res.status(400).json({ message: 'El usuario no tiene este rol' });
        }
        user.roles = user.roles.filter(r => r !== rol);
            await user.save();
            return res.status(200).json({ success: true, message: "Rol eliminado" })
    }
    catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
};




module.exports = {
    registerUser,
    updateUser,
    deleteUser,
    loginUser,
    getCurrentUser,
    magicLink,
    logOutUser,
    updateSite,
    getLocalOrganizersPerSite,
    getUsers,
    getJammersPerSite,
    getJammersNotInTeamPerSite,
    getStaffPerSite,
    registerUsersFromCSV,
    addRol,
    deleteRol
};