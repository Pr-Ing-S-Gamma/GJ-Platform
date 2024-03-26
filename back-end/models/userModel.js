const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = mongoose.Schema({
    email: {
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    region: { 
        type: Schema.Types.ObjectId, 
        ref: 'Region',
        required: true
    },
    site: { 
        type: Schema.Types.ObjectId, 
        ref: 'Site',
        required: true
    },
    team: { 
        type: Schema.Types.ObjectId, 
        ref: 'Team' 
    },
    rol: {
        type: String,
        required: true
    },
    coins: { 
        type: Number, 
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    lastUpdateDate: {
        type: Date
    }
});

module.exports = mongoose.model("User", userSchema);