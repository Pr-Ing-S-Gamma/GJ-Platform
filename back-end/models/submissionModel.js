const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    pitch: {
        type:String,
        required:true
    },
    game: {
        type:String,
        required:true
    },
    team: {
        type: Schema.Types.ObjectId, 
        ref: 'Team',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId, 
        ref: 'Category',
        required: false
    },
    stage: {
        type: Schema.Types.ObjectId, 
        ref: 'Stage',
        required: true
    },
    theme: {
        type: Schema.Types.ObjectId, 
        ref: 'Theme',
        required: false
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

module.exports = mongoose.model("Submission", submissionSchema);