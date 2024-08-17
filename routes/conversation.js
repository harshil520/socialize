const { Router } = require("express");
const conversationController = require("../controller/conversation");

const conversationRoute = Router();

conversationRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "conversation Route." });
});

conversationRoute.post("/create", conversationController.createConversation);
conversationRoute.get("/get/:userId", conversationController.getConversation);
conversationRoute.get("/get/:firstUserId/:secondUserId", conversationController.getTwoUserConversation);
conversationRoute.delete("/delete/:conversationId", conversationController.deleteConversation);

module.exports = conversationRoute;