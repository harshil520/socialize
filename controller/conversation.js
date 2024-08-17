const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const createConversation = async (req, res) => {
    try {
        let conversation;

        if (req.body.firstUser !== req.body.secondUser) {
            conversation = new Conversation({
                participants: [req.body.firstUser, req.body.secondUser]
            });
        } else {
            res.send({ status: 400, message: "both user must be different." });
        }

        const save = await conversation.save();

        res.send({ status: 201, message: save });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        })

        res.send({ status: 200, message: conversations });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const getTwoUserConversation = async (req, res) => {
    try {
        const { firstUserId, secondUserId } = req.params;

        const conversations = await Conversation.find({
            participants: { $all: [firstUserId, secondUserId] }
        });

        res.send({ status: 200, message: conversations });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        await Conversation.deleteOne({ _id: conversationId });
        await Message.deleteMany({ conversationID: conversationId })

        res.send({ status: 200, message: "conversations deleted." });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

module.exports = {
    createConversation, getConversation, getTwoUserConversation,
    deleteConversation
};