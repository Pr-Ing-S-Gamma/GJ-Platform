const Judge = require('../models/judgeModel');

const registerJudge = async (req, res) => {
    const { email, siteId } = req.body;

    try {
        const existingEmail = await Judge.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ success: false, error: "El correo electrónico ya está en uso." });
        }

        const judge = new Judge({
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

        await judge.save();
        res.status(200).json({ success: true, msg: 'Se ha registrado correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateJudgeSite = async (req, res) => {
    const { id } = req.params; 
    const { siteId } = req.body; 

    try {
        const judge = await Judge.findByIdAndUpdate(id, { site: siteId }, { new: true });

        if (!judge) {
            return res.status(404).json({ message: 'Juez no encontrado' });
        }

        return res.status(200).json(judge);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getJudgesPerSite = async (req, res) => {
    const { siteId } = req.params;

    try {
        const judges = await Judge.find({ site: siteId })
            .populate('site', 'name') // Populate para obtener el nombre del sitio
            .select('name email'); // Seleccionar solo el nombre y el correo electrónico
        
        if (judges.length === 0) {
            return res.status(404).json({ success: false, error: "No se encontraron jueces para este sitio" });
        }

        return res.status(200).json({ success: true, judges });
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los jueces por sitio" });
    }
};

module.exports = {
    registerJudge,
    updateJudgeSite,
    getJudgesPerSite
};
