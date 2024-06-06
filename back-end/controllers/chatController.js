const mongoose = require('mongoose');
const Chat = require('../models/chatModel')

const createChat = async (req, res) => {
    const { participants } = req.body;

    try {
        const chat = new Chat({
            participants: participants.map(participant => ({
                participantType: participant.participantType,
                participantId: participant.participantId
            }))
        })

        await chat.save();
        res.status(200).json({ success: true, msg: 'chat created', data: chat});
    }
    catch(error){
        res.status(400).json({ success: false, error: error.message });
    }

};





module.exports = {
    createChat
};