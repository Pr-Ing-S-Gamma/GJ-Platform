const mongoose = require('mongoose');
const User = require('./userModel');
const globalOrganizerSchema = mongoose.Schema({
    ascendedToGlobalDate: {
        type: Date,
        required: true
    }
});

module.exports = User.discriminator("GlobalOrganizer", globalOrganizerSchema);