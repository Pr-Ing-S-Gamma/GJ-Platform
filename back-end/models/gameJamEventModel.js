const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameJamSchema = mongoose.Schema({
    edition: {
        type:String,
        required:true
    },
    stages: [{
        type: Schema.Types.ObjectId,
        ref: 'Stage'
    }],
    site: {
        type: Schema.Types.ObjectId,
        ref: 'Site'
    },
    creatorUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'GlobalOrganizer',
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
            ref: 'GlobalOrganizer'
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

module.exports = mongoose.model("GameJam", gameJamSchema);