const { Schema, default: mongoose, model } = require("mongoose");

const postScheme = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    caption: {
        type: String,
        required: true
    },
    image: [{
        type: String,
        required: false
    }],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: "Comment"
    }]
}, {
    timestamps: true
});

const Post = model("Post", postScheme);

module.exports = Post;