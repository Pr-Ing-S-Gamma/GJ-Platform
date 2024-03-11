const mongoose = require('mongoose');
const User = require('./userModel');
const { Schema } = mongoose;
const jammerSchema = mongoose.Schema({
    site: { 
        type: Schema.Types.ObjectId, 
        ref: 'Site',
        required: true
    },
    team: { 
        type: Schema.Types.ObjectId, 
        ref: 'Team' 
    }
});

module.exports = User.discriminator("Jammer", jammerSchema);