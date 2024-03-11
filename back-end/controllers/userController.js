const User = require('../models/userModel');
const { sendEmail } = require('../services/mailer');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    const email = req.body.email;
    const existingUser = await User.findOne({ email });
    let rol;
    let userId;
    if (!existingUser) {
        res.status(400).send(`El correo ${email} no existe en la base de datos.`);
    }
    
    rol = existingUser.__t;
    userId = existingUser._id;

    const token = jwt.sign({ userId, rol }, 'MY_JWT_SECRET', { expiresIn: 600000 });
    const magicLink = `http://localhost:3000/api/user/magic-link/${token}`;
    // const subject = 'Magic Link';
    // const text = `Hi, click on this link to continue to the app: ${magicLink}`;
    // await sendEmail(email, subject, text);
    res.status(200).json({ success: true, msg: 'Se envió el magic link al usuario.', magicLink });
};

const magicLink = async (req, res) => {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, 'MY_JWT_SECRET');
    const userId = decodedToken.userId;
    const rol = decodedToken.rol;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters[randomIndex];
    }

    const newToken = jwt.sign({ userId, rol, verificationCode }, 'MY_JWT_SECRET');

    res.cookie('token', newToken);
    res.status(200).json({ success: true, verificationCode });
};

const verifyMagicLink = async (req, res) => {
    const verificationCode = req.body.verificationCode;
    const token = req.cookies.token;

    try {
        const decodedToken = jwt.verify(token, 'MY_JWT_SECRET');
        const userId = decodedToken.userId;
        const rol = decodedToken.rol;
        const tokenVerificationCode = decodedToken.verificationCode;

        if (verificationCode === tokenVerificationCode) {

            const newToken = jwt.sign({ userId, rol }, 'MY_JWT_SECRET');
            res.cookie('token', newToken);

            res.status(200).json({ success: true, msg: 'Se ha logeado correctamente', userId, rol});
        } else {
            res.status(400).json({ success: false, msg: 'Código de verificación inválido' });
        }
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Token JWT inválido' });
    }
};

module.exports = {
    loginUser,
    magicLink,
    verifyMagicLink
};