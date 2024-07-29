const { Schema, default: mongoose, model } = require("mongoose");

const messageScheme = new Schema({
    conversationID: {
        type: mongoose.Schema.ObjectId,
        ref: "Conversation",
        required: true,
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Message = model("Message", messageScheme);

module.exports = Message;