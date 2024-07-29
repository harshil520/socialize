const { Schema, default: mongoose, model } = require("mongoose");

const userScheme = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: "Post"
    }],
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    followings: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    blockList: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
});

const User = model("User", userScheme);

module.exports = User;