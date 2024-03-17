const mongoose = require('mongoose');
const User = require('./userModel');
const { Schema } = mongoose;
const judgeSchema = mongoose.Schema({
    site: { 
        type: Schema.Types.ObjectId, 
        ref: 'Site',
        required: true
    }
});

module.exports = User.discriminator("Judge", judgeSchema);