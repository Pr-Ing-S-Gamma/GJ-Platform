const Jammer = require('../models/jammerModel');
const { sendEmail } = require('../services/mailer');

const registerJammer = async (req, res) => {
    const { email, siteId, teamId } = req.body;

    try {
        const existingEmail = await Jammer.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ success: false, error: "El correo electrónico ya está en uso." });
        }

        const jammer = new Jammer({
            name: req.body.name,
            email: email,
            image: {
                name: req.file.originalname,
                type: req.file.mimetype,
                data: req.file.buffer
            },
            site: siteId,
            team: teamId,
            creationDate: new Date()
        });

        await jammer.save();
        // const subject = 'Registro exitoso';
        // const text = 'Gracias por registrarte en GameJam+. Cuando quieras ingresar a la plataforma, solo ingresa con tu correo electrónico: ' + email;
        // await sendEmail(email, subject, text);
        res.status(200).json({ success: true, msg: 'Se ha registrado correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    registerJammer
};