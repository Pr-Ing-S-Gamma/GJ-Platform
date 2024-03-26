const User = require('../models/userModel');
const { sendEmail } = require('../services/mailer');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, regionId, siteId, rol, coins } = req.body;
    try {
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ success: false, error: "El correo electrónico ya está en uso." });
        }

        const jammer = new User({
            name: name,
            email: email,
            region: regionId,
            site: siteId,
            rol: rol,
            coins: coins,
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

const loginUser = async (req, res) => {
    const email = req.body.email;
    const existingUser = await User.findOne({ email });
    let rol;
    let userId;
    if (!existingUser) {
        res.status(400).send(`El correo ${email} no existe en la base de datos.`);
    }
    
    rol = existingUser.rol;
    userId = existingUser._id;

    const token = jwt.sign({ userId, rol }, 'MY_JWT_SECRET', { expiresIn: 600000 });
    const magicLink = `http://localhost:3000/api/user/magic-link/${token}`;
    const subject = 'Login in GameJam Platform';
    const text = `Hi, click on this link to continue to the app: ${magicLink}`;
    await sendEmail(email, subject, text);
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
        let redirectUrl;
        if (rol === 'GlobalOrganizer') {
            redirectUrl = 'http://localhost:4200/DataManagement';
        } 
        // else if (rol === 'user') {
        //     redirectUrl = '/user-dashboard'; // Redirigir a un panel de usuario normal
        // } else {
        //     // Redirigir a una página predeterminada para roles desconocidos
        //     redirectUrl = '/default-dashboard';
        // }
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error al procesar el token:', error);
        res.status(500).json({ success: false, error: 'Error al procesar el token' });
    }
};

const getLocalOrganizersPerSite = async (req, res)=>{
    try {
        const siteID = req.params.site;
        console.log(siteID)
        var organizers = await LocalOrganizer.find({site : siteID});
        return res.status(200).send({success: true, msg: "Organizadores econtrados para site ", data: organizers});
    } catch (error) {
        return res.status(400).send({success: false, msg: error.message});
    }
};

const assignRol = async (req, res) => {
    const {rol, userId} = req.body
 
    User.findById(userId)
    .then(existingUser => {
      if (existingUser) {
        existingUser.rol = rol;
        return existingUser.save();
      } else {
        return res.status(400).json({success: false, error: "El usuario no existe"})
      }
    })
    .then(updatedUser => {
        return res.status(200).json({success: true, error: "Rol " + updatedUser.rol +" asignado"})
    })
    .catch(error => {
        return res.status(400).json({success: false, error: error})
    });
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
const getJudgesPerSite = async (req, res) => {
    const { siteId } = req.params;
    try {
        const judges = await User.find({ site: siteId, rol: 'Judge'})
            .populate('site', 'name')
            .select('name email'); 
        if (judges.length === 0) {
            return res.status(404).json({ success: false, error: "No se encontraron jueces para este sitio" });
        }
        return res.status(200).json({ success: true, judges });
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los jueces por sitio" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    magicLink,
    assignRol,
    updateSite,
    getJudgesPerSite,
    getLocalOrganizersPerSite
};