const { Router } = require("express");
const getAuth = require("../routes/auth");
const getUser = require("../routes/user");
const getPost = require("../routes/post");
const getComment = require("../routes/comment");

const v1 = Router();

v1.get("/", (req, res) => {
    res.send({ status: 200, message: "v1 Route." });
});

v1.use("/auth", getAuth);
v1.use("/user", getUser);
v1.use("/post", getPost);
v1.use("/comment", getComment);

module.exports = v1;