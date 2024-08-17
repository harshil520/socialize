const Message = require("../models/Message");

const createMessage = async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();

        res.send({ status: 201, message: "message created.", data: message });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const message = await Message.find({
            conversationId: conversationId
        });
        console.log(message);

        res.send({ status: 200, message: "message fetched.", data: message });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.messageId);

        res.send({ status: 200, message: "message deleted." });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

module.exports = {
    createMessage, getMessages, deleteMessage
};