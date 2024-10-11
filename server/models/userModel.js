const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "c:\Users\SAGAR\OneDrive\Desktop\Whatsapp Icons\avatar1.jpeg",
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;