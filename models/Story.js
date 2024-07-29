const { Schema, default: mongoose, model } = require("mongoose");

const storyScheme = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    image: [{
        type: String,
        required: false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Story = model("Story", storyScheme);

module.exports = Story;