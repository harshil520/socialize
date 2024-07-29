const { Router } = require("express");
const commentController = require("../controller/comment");

const commentRoute = Router();

commentRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "comment Route." });
});

module.exports = commentRoute;