const mongoose = require('mongoose');
const Chat = require('../models/chatModel')

const createChat = async (req, res) => {
    const { participants } = req.body;

    try {
        const chatParticipants = [];

        for (const participant of participants) {
            const chatParticipant = {
                participantType: participant.participantType,
                participantId: participant.participantId
            };
            chatParticipants.push(chatParticipant);
        }


        const chat = new Chat({participants: chatParticipants})
        await chat.save();

        res.status(200).json({ success: true, msg: 'chat created', data: chat.participants});
    }
    catch(error){
        res.status(400).json({ success: false, error: error.message });
    }

};

const getChat = async (req, res) =>{
    const id  = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'El ID proporcionado no es válido.' });
    }

    const existingChat = await Chat.findById(id);
    if(existingChat){
        return res.status(200).json({ success: true, msg: 'chat', data: existingChat});
    }
    return res.status(400).json({ success: false, msg: 'No existe el chat' });
}



module.exports = {
    createChat,
    getChat
};

/*const chat = new Chat({
            participants: participants.map(participant => ({
                participantType: participant.participantType,
                participantId: participant.participantId
            }))
        })*/