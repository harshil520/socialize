const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Story = require("../models/Story");
const { uploadToCloudinary } = require("../helper/utils");

const createStory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { text } = req.body;

        let image = "";
        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (req.file) {
            image = await uploadToCloudinary(req.file);
        }

        const story = new Story({
            user: userId,
            image,
            text
        });

        await story.save();

        res.send({ status: 201, message: "story created.", data: story });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const getAllFollowingUserStory = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const following = user.followings;
        const stories = await Story.find({ user: { $in: following } }).populate("user", "fullName userName profilePicture");

        res.send({ status: 200, message: "stories fetched.", data: stories });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const getUserStory = async (req, res) => {
    try {
        const { userId } = req.params;

        const story = await Story.find({ user: userId }).populate("user", "fullName userName profilePicture");
        if (!story) {
            return res.send({ status: 404, message: "story not found." });
        }

        res.send({ status: 200, message: "stories fetched.", data: story });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const deleteStory = async (req, res) => {
    try {
        const { storyId } = req.params;

        const story = await Story.findByIdAndDelete(storyId);
        if (!story) {
            return res.send({ status: 404, message: "story not found." });
        }

        res.send({ status: 200, message: "story deleted." });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

module.exports = { createStory, getAllFollowingUserStory, getUserStory, deleteStory };