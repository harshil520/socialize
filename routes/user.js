const { Router } = require("express");
const userController = require("../controller/user");
const upload = require("../middlewares/upload");

const userRoute = Router();

userRoute.get("/", (req, res) => {
    res.send({ status: 200, message: "User Route." });
});

userRoute.get("/:userId", userController.getUser);
userRoute.put("/update/:userId", userController.updateUser);
userRoute.post("/follow/:userId", userController.followUser);
userRoute.post("/unfollow/:userId", userController.unFollowUser);
userRoute.post("/block/:userId", userController.blockUser);
userRoute.post("/unblock/:userId", userController.unBlockUser);
userRoute.get("/blocklist/:userId", userController.blockList);
userRoute.delete("/delete/:userId", userController.deleteUser);
userRoute.get("/search/:query", userController.searchUser);
userRoute.put("/upload-profile-picture/:userId", upload.single("profilePicture"), userController.uploadProfilePicture);

module.exports = userRoute;