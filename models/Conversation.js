const { Schema, default: mongoose, model } = require("mongoose");

const conversationScheme = new Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }]
}, {
    timestamps: true
});

const Conversation = model("Conversation", conversationScheme);

module.exports = Conversation;