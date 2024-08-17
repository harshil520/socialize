const { Router } = require("express");
const postController = require("../controller/post");
const upload = require("../middlewares/upload");

const postRoute = Router();

postRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "post Route." });
});

postRoute.post("/create", postController.createPost);
postRoute.post("/createwithimage", upload.array("image", 5), postController.createPostWithImage);
postRoute.put("/update", postController.updatePost);
postRoute.get("/getall/:userId", postController.getAllPost);
postRoute.get("/getuserpost/:userId", postController.getUserPost);
postRoute.delete("/delete/:postId", postController.deletePost);
postRoute.post("/like/:postId", postController.likePost);
postRoute.post("/dislike/:postId", postController.disLikePost);
postRoute.post("/save/:postId", postController.savePost);
postRoute.post("/unsave/:postId", postController.unsavePost);

module.exports = postRoute;