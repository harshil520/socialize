const { Router } = require("express");
const getAuth = require("../routes/auth");
const getUser = require("../routes/user");
const getPost = require("../routes/post");
const getComment = require("../routes/comment");
const getStory = require("../routes/story");
const getConversation = require("../routes/conversation");
const getMessage = require("../routes/message");
const { verifyToken } = require("../middlewares/verifyToken");

const v1 = Router();

v1.get("/", (req, res) => {
    res.send({ status: 200, message: "v1 Route." });
});

v1.use("/auth", getAuth);
v1.use("/user", verifyToken, getUser);
v1.use("/post", verifyToken, getPost);
v1.use("/comment", verifyToken, getComment);
v1.use("/story", verifyToken, getStory);
v1.use("/conversation", verifyToken, getConversation);
v1.use("/message", verifyToken, getMessage);

module.exports = v1;