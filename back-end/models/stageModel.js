const mongoose = require('mongoose');
const { Schema } = mongoose;

const stageSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    gameJam: {
        type: Schema.Types.ObjectId,
        ref: 'GameJam',
        required: true
    },
    creatorUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
        }
    },
    creationDate: {
        type: Date,
        required: true
    },
    lastUpdateUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        name: { 
            type: String
        },
        email: { 
            type: String
        }
    },
    lastUpdateDate: {
        type: Date
    }
});

module.exports = mongoose.model("Stage", stageSchema);