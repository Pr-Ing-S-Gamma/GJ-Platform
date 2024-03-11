const mongoose = require('mongoose');
const User = require('./userModel');
const { Schema } = mongoose;
const localOrganizerSchema = mongoose.Schema({
    site: { 
        type: Schema.Types.ObjectId, 
        ref: 'Site',
        required: true
    },
    coins: { 
        type: Number, 
        required: true
    }
});

module.exports = User.discriminator("LocalOrganizer", localOrganizerSchema);