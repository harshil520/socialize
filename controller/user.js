const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Story = require("../models/Story");
const { uploadToCloudinary } = require("../helper/utils");

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }
        res.send({ status: 200, message: user });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        Object.assign(user, updateData);
        await user.save();
        res.send({ status: 200, message: "user updated.", data: user });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { _id } = req.body;
        if (userId == _id) {
            return res.send({ status: 500, message: "you cannot follow yourself." });
        }

        const userToFollow = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if (!userToFollow || !loggedInUser) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (loggedInUser.followings.includes(userId)) {
            return res.send({ status: 400, message: "you already follow this user." });
        }

        loggedInUser.followings.push(userId);
        userToFollow.followers.push(_id);

        await loggedInUser.save();
        await userToFollow.save();

        res.send({ status: 200, message: `you followed ${userToFollow.userName}.` });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const unFollowUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { _id } = req.body;
        if (userId == _id) {
            return res.send({ status: 500, message: "you cannot unfollow yourself." });
        }

        const userToUnFollow = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if (!userToUnFollow || !loggedInUser) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (!loggedInUser.followings.includes(userId)) {
            return res.send({ status: 400, message: "you not following this user." });
        }

        loggedInUser.followings = loggedInUser.followings.filter(id => id.toString() !== userId);
        userToUnFollow.followers = userToUnFollow.followers.filter(id => id.toString() !== _id);

        await loggedInUser.save();
        await userToUnFollow.save();

        res.send({ status: 200, message: `you unfollowed ${userToUnFollow.userName}.` });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { _id } = req.body;
        if (userId == _id) {
            return res.send({ status: 500, message: "you cannot block yourself." });
        }

        const userToBlock = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if (!userToBlock || !loggedInUser) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (loggedInUser.blockList.includes(userId)) {
            return res.send({ status: 400, message: "you already block this user." });
        }

        loggedInUser.blockList.push(userId);
        loggedInUser.followings = loggedInUser.followings.filter(id => id.toString() !== userId);
        userToBlock.followers = userToBlock.followers.filter(id => id.toString() !== _id);

        await loggedInUser.save();
        await userToBlock.save();

        res.send({ status: 200, message: `you blocked ${userToBlock.userName}.` });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const unBlockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { _id } = req.body;
        if (userId == _id) {
            return res.send({ status: 500, message: "you cannot unblock yourself." });
        }

        const userToUnBlock = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if (!userToUnBlock || !loggedInUser) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (!loggedInUser.blockList.includes(userId)) {
            return res.send({ status: 400, message: "you already unblock this user." });
        }

        loggedInUser.blockList = loggedInUser.blockList.filter(id => id.toString() !== userId);

        await loggedInUser.save();

        res.send({ status: 200, message: `you unblocked ${userToUnBlock.userName}.` });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const blockList = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("blockList", "userName fullName profilePicture");
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        res.send({ status: 200, message: user.blockList });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        await Post.deleteMany({ user: userId });
        await Comment.deleteMany({ user: userId });
        await Story.deleteMany({ user: userId });
        await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
        await User.updateMany(
            { _id: { $in: user.followings } },
            { $pull: { followers: userId } }
        );

        await Comment.updateMany({}, { $pull: { likes: userId } });
        await Comment.updateMany(
            { "replies.likes": userId },
            { $pull: { "replies.likes": userId } }
        );

        const replyComment = await Comment.find({ "replies.user": userId });
        await Promise.all(
            replyComment.map(async (comment) => {
                comment.replies = comment.replies.filter((reply) => reply.user.toString() !== userId);
                await Comment.save();
            })
        );

        await user.deleteOne();

        res.send({ status: 200, message: "user deleted successfully.\n warning: all the data associated with this user is deleted." });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const searchUser = async (req, res) => {
    try {
        const { query } = req.params;

        const user = await User.find({
            $or: [
                { userName: { $regex: new RegExp(query, "i") } },
                { fullName: { $regex: new RegExp(query, "i") } }
            ]
        })

        res.send({ status: 200, message: user });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

const uploadProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        const { filename } = req.file;

        const user = await User.findOneAndUpdate({ _id: userId }, { profilePicture: await uploadToCloudinary(req.file) }, { new: true });

        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        res.send({ status: 200, message: user });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
}

module.exports = { getUser, updateUser, followUser, unFollowUser, blockUser, unBlockUser, blockList, deleteUser, searchUser, uploadProfilePicture };