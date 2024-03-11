const mongoose = require('mongoose');
const User = require('./userModel');
const { Schema } = mongoose;
const jammerSchema = mongoose.Schema({
    siteId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Site',
        required: true
    },
    teamId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Team' 
    }
});

module.exports = User.discriminator("Jammer", jammerSchema);