const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    participating: {
        type: Number,
        required: true
    },
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
    teamId: {
        type: Schema.Types.ObjectId, 
        ref: 'Team',
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId, 
        ref: 'Category',
        required: false
    },
    stageId: {
        type: Schema.Types.ObjectId, 
        ref: 'Stage',
        required: true
    },
    themeId: {
        type: Schema.Types.ObjectId, 
        ref: 'Theme',
        required: false
    },
    numberEvaluations: {
        type: Number
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
    evaluators: [{
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        name: { 
            type: String
        },
        email: { 
            type: String
        },
        pitchScore: { type: Number },
        pitchFeedback: { type: String },
        gameDesignScore: { type: Number },
        gameDesignFeedback: { type: String },
        artScore: { type: Number },
        artFeedback: { type: String },
        buildScore: { type: Number },
        buildFeedback: { type: String },
        audioScore: { type: Number },
        audioFeedback: { type: String },
        generalFeedback: { type: String }
    }],
    lastUpdateDate: {
        type: Date
    }
});

submissionSchema.index({numberEvaluations: 1});
module.exports = mongoose.model("Submission", submissionSchema);