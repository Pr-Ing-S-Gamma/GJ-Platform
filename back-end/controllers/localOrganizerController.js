const { default: mongoose } = require('mongoose');
const LocalOrganizer = require('../models/localOrganizerModel');
const { sendEmail } = require('../services/mailer');

const registerLocalOrganizer = async (req, res) => {
    const { email, siteId } = req.body;

    try {
        const existingEmail = await LocalOrganizer.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ success: false, error: "El correo electrónico ya está en uso." });
        }

        const localOrganizer = new LocalOrganizer({
            name: req.body.name,
            coins: req.body.coins,
            email: email,
            image: {
                name: req.file.originalname,
                type: req.file.mimetype,
                data: req.file.buffer
            },
            site: siteId,
            creationDate: new Date()
        });

        await localOrganizer.save();
        // const subject = 'Registro exitoso';
        // const text = 'Gracias por registrarte en GameJam+. Cuando quieras ingresar a la plataforma, solo ingresa con tu correo electrónico: ' + email;
        // await sendEmail(email, subject, text);
        res.status(200).json({ success: true, msg: 'Se ha registrado correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getLocalOrganizersSite = async (req, res)=>{
    try {
        const siteID = req.params.site;
        console.log(siteID)
        var organizers = await LocalOrganizer.find({site : siteID});
        return res.status(200).send({success: true, msg: "Organizadores econtrados para site ", data: organizers});
    } catch (error) {
        return res.status(400).send({success: false, msg: error.message});
    }
};

module.exports = {
    registerLocalOrganizer,
    getLocalOrganizersSite
};