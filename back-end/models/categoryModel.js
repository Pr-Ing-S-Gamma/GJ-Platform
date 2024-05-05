const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = mongoose.Schema({
    titleSP: {
        type: String,
        required: true
    },
    titleEN: {
        type: String,
        required: true
    },
    titlePT: {
        type: String,
        required: true
    },
    descriptionSP: {
        type: String,
        required: true
    },
    descriptionEN: {
        type: String,
        required: true
    },
    descriptionPT: {
        type: String,
        required: true
    },
    manualSP: {
        type: String,
        required: true
    },
    manualEN: {
        type: String,
        required: true
    },
    manualPT: {
        type: String,
        required: true
    },
    creatorUser: {
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