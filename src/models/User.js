const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        unique: true, 
        required: true, 
        match: [/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/i, 'Invalid email address']
    },
    password: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
