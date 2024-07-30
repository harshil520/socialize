const { Router } = require("express");
const commentController = require("../controller/comment");

const commentRoute = Router();

commentRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "comment Route." });
});

commentRoute.post("/create", commentController.createComment);
commentRoute.post("/reply/:commentId", commentController.replyComment);
commentRoute.put("/update/:commentId", commentController.updateComment);
commentRoute.put("/update/:commentId/replies/:replyId", commentController.updateReplyComment);
commentRoute.get("/post/:postId", commentController.getPostComment);
commentRoute.delete("/delete/:commentId", commentController.deleteComment);
commentRoute.delete("/delete/:commentId/replies/:replyId", commentController.deleteReplyComment);
commentRoute.post("/like/:commentId", commentController.likeComment);
commentRoute.post("/dislike/:commentId", commentController.disLikeComment);
commentRoute.post("/like/:commentId/replies/:replyId", commentController.likeReplyComment);
commentRoute.post("/dislike/:commentId/replies/:replyId", commentController.disLikeReplyComment);

module.exports = commentRoute;