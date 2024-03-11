const mongoose = require('mongoose');
const { Schema } = mongoose;

const siteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region' 
    },
    country:  {
        name: { 
            type: String, 
            required: true 
        },
        code: { 
            type: String, 
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

module.exports = mongoose.model("Site", siteSchema);
