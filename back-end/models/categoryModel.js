const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = mongoose.Schema({
    titleSP: {
        type: String,
        required: false
    },
    titleEN: {
        type: String,
        required: false
    },
    titlePT: {
        type: String,
        required: false
    },
    descriptionSP: {
        type: String,
        required: false
    },
    descriptionEN: {
        type: String,
        required: false
    },
    descriptionPT: {
        type: String,
        required: false
    },
    manualSP: {
        type: String,
        required: false
    },
    manualEN: {
        type: String,
        required: false
    },
    manualPT: {
        type: String,
        required: false
    },
    creatorUser: {
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
        required: false
    },
    lastUpdateUser: {
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

module.exports = mongoose.model("Category", categorySchema);