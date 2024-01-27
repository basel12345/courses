const mongoose = require("mongoose");
const validator = require("validator");
const { Roles } = require("../utils/roles")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "filed must be a valid email address"]
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [Roles.MANGER, Roles.USER, Roles.ADMIN],
        default: Roles.USER
    },
    profile: {
        type: String
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User;
