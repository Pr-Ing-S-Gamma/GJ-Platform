const mongoose = require('mongoose');
const { Schema } = mongoose;

const themeSchema = mongoose.Schema({
    manualPT: {
        type: String
    },
    manualSP: {
        type: String
    },
    manualEN: {
        type: String
    },
    descriptionSP: {
        type: String
    },
    descriptionPT: {
        type: String
    },
    descriptionEN: {
        type: String
    },
    titleSP: {
        type: String
    },
    titleEN: {
        type: String
    },
    titlePT: {
        type: String
    },
    creatorUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'GlobalOrganizer',
            required: false
        },
        name: { 
            type: String, 
            required: false 
        },
        email: { 
            type: String, 
            required: false 
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

module.exports = mongoose.model("Theme", themeSchema);
