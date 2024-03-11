const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image: {
        name: { 
            type: String, 
            required: true 
        },
        type: { 
            type: String, 
            required: true 
        },
        data: { 
            type: Buffer, 
            required: true 
        }
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