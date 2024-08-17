const { Router } = require("express");
const messageController = require("../controller/message");
const upload = require("../middlewares/upload");

const messageRoute = Router();

messageRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "message Route." });
});

messageRoute.post("/create", messageController.createMessage);
messageRoute.get("/get/:conversationId", messageController.getMessages);
messageRoute.delete("/delete/:messageId", messageController.deleteMessage);

module.exports = messageRoute;