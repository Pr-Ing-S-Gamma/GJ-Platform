const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = mongoose.Schema({
    studioName: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
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
    linkTree: [{
        type:String,
        required:true
    }],
    gameJam:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GameJam',
            required: true
        },
        edition: { 
            type: String, 
            required: true 
        }
    },
    jammers:  [{
        _id: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        name: { 
            type: String
        },
        email: { 
            type: String
        }
    }],
    lastSub: {
        type: Schema.Types.ObjectId,
        ref: 'Submission',
        require: true
    },
    submissions:   [{
        type: Schema.Types.ObjectId, 
        ref: 'Submission',
        required: false
    }],
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

module.exports = mongoose.model("Team", teamSchema);