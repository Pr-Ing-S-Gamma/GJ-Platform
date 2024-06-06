const mongoose = require('mongoose');
const Chat = require('../models/chatModel')
const Team = require('../models/teamModel')
const User = require('../models/userModel')

const createChat = async (req, res) => {
    const { participants } = req.body;
    
    if (!participants) {
      return res.status(400).json({ success: false, error: 'Participants are required.' });
    }
  
    try {
      const chat = new Chat({
        participants: participants.map(participant => ({
          participantType: participant.participantType,
          participantId: participant.participantId
        }))
      });
  
      await chat.save();
  
      res.status(200).json({ success: true, msg: 'Chat created', data: chat });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
  

const getChat = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'El ID proporcionado no es válido.' });
    }

    const existingChat = await Chat.findById(id);
    if (existingChat) {
        return res.status(200).json({ success: true, msg: 'chat', data: existingChat });
    }
    return res.status(400).json({ success: false, msg: 'No existe el chat' });
};

const sendMessage = async (req, res) => {
    const { sender, msg } = req.body;
    const id = req.params.id;

    try {
        const chat = await Chat.findById(id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID proporcionado no es válido.' });
        }
        if(!chat){
            return res.status(400).json({ success: false, msg: 'No existe el chat' });
        }
        chat.messagesList.push({
            senderId: sender.Id,
            senderType:sender.Type,
            message: msg,
            sentDate: new Date()
        })

        await chat.save();
        return res.status(200).json({ success: true, msg: 'chat', data: chat.messagesList });
        
    } catch (error) {
        return res.status(400).json({ success: false, msg: 'error al enviar' });
    }



};

const getChatbyParticipants = async(req, res) =>{
    const {participantIds} = req.body;

    const chat = await Chat.find({
        'participants.participantId': { $all: participantIds }
    });

    if(chat){
        return res.status(200).json({ success: true, msg: 'chat', data: chat });
    }

    return res.status(400).json({ success: false, msg: 'error' });


};


module.exports = {
    createChat,
    getChat,
    sendMessage,
    getChatbyParticipants
};

/*const chat = new Chat({
            participants: participants.map(participant => ({
                participantType: participant.participantType,
                participantId: participant.participantId
            }))
        })*/