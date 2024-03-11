const mongoose = require('mongoose');
const { Schema } = mongoose;

const themeSchema = mongoose.Schema({
    ManualPT: {
        Type: String
    },
    ManualSP: {
        Type: String
    },
    manualEN: {
        Type: String
    },
    descriptionSP: {
        Type: String
    },
    descriptionPT: {
        Type: String
    },
    descriptionEN: {
        Type: String
    },
    TitleSP: {
        Type: String
    },
    TitleEN: {
        Type: String
    },
    TitlePT: {
        Type: String
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
    },
    gamejam: [{
        type: Schema.Types.ObjectId, 
        ref : 'GameJam'
    }]
});

module.exports = mongoose.model("theme", themeSchema);