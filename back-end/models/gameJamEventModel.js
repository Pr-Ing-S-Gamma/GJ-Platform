const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameJamSchema = mongoose.Schema({
    edition: {
        type:String,
        required:true
    },
    stages: [{
        _id: { type: Schema.Types.ObjectId, ref: 'Stage'},
        name: { 
            type: String
        },
        startDate: { 
            type: Date
        },
        endDate: { 
            type: Date
        },
    }],
    region:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Region',
            required: true
        },
        name: { 
            type: String, 
            required: true 
        }
    },
    site:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Site',
            required: true
        },
        name: { 
            type: String, 
            required: true 
        }
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