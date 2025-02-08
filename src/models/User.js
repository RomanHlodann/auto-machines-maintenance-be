const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        unique: true, 
        required: true, 
        match: ['^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$', 'Invalid email address']
    },
    password: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
