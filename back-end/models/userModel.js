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
    region:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Region',
            required: false
        },
        name: { 
            type: String, 
            required: false 
        }
    },
    site:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Site',
            required: false
        },
        name: { 
            type: String, 
            required: false 
        }
    },
    team:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        name: { 
            type: String
        }
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