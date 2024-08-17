const { Router } = require("express");
const storyController = require("../controller/story");
const upload = require("../middlewares/upload");

const storyRoute = Router();

storyRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "story Route." });
});

storyRoute.post("/create/:userId", upload.single("image"), storyController.createStory);
storyRoute.get("/getall/:userId", storyController.getAllFollowingUserStory);
storyRoute.get("/user/:userId", storyController.getUserStory);
storyRoute.delete("/delete/:storyId", storyController.deleteStory);

module.exports = storyRoute;