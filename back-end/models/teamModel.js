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
    linkTree: [{
        type:String,
        required:true
    }],
    gameJam: {
        type: Schema.Types.ObjectId, 
        ref: 'GameJam',
        required: true
    },
    jammers:  [{
        type: Schema.Types.ObjectId, 
        ref: 'Jammer',
        required: true
    }],
    submissions:   [{
        type: Schema.Types.ObjectId, 
        ref: 'Submission'
    }],
    logo: {
        name: { 
            type: String, 
            required: true 
        },
        type: { 
            type: String, 
            required: true 
        },
        data: { 
            type: Buffer, 
            required: true 
        }
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

module.exports = mongoose.model("Team", teamSchema);