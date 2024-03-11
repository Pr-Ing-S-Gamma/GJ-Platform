const GlobalOrganizer = require('../models/globalOrganizerModel');
const { sendEmail } = require('../services/mailer');
const jwt = require('jsonwebtoken');

const registerGlobalOrganizer = async (req, res) => {
    const { email } = req.body;
    
    try {
        const existingEmail = await GlobalOrganizer.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ success: false, error: "El correo electrónico ya está en uso." });
        }

        const globalOrganizer = new GlobalOrganizer({
            name: req.body.name,
            email: email,
            image: {
                name: req.file.originalname,
                type: req.file.mimetype,
                data: req.file.buffer
            },
            creationDate: new Date(),
            ascendedToGlobalDate: new Date()
        });

        await globalOrganizer.save();
        // const subject = 'Registro exitoso';
        // const text = 'Gracias por registrarte en GameJam+. Cuando quieras ingresar a la plataforma, solo ingresa con tu correo electrónico: ' + email;
        // await sendEmail(email, subject, text);
        res.status(200).json({ success: true, msg: 'Se ha registrado correctamente al organizador Global' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    registerGlobalOrganizer
};