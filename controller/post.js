const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { generateFileURL } = require("../helper/utils");

const createPost = async (req, res) => {
    try {
        const { userId, caption } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const post = new Post({
            user: userId,
            caption: caption
        });

        await post.save();
        user.posts.push(post._id);
        await user.save();

        res.send({ status: 200, message: post });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

const createPostWithImage = async (req, res) => {
    try {
        const { userId, caption } = req.body;
        const files = req.files;
        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }
        const imageURLs = files.map(file => generateFileURL(file.filename));

        const post = new Post({
            user: userId,
            caption: caption,
            image: imageURLs
        });

        await post.save();
        user.posts.push(post);
        await user.save();

        res.send({ status: 200, message: post });
    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

const updatePost = async (req, res) => {
    try {
        const { postId, caption } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send({ status: 404, message: "post not found." });
        }

        post.caption = caption || post.caption;
        await post.save();

        res.send({ status: 200, message: post });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

const getAllPost = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const blockedUsers = user.blockList.map(id => id.toString());
        const allPosts = await Post.find({
            user: { $nin: blockedUsers }
        }).populate("user", "userName fullName profilePicture");

        res.send({ status: 200, message: allPosts });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

const getUserPost = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const allPost = await Post.find({
            user: userId
        });

        res.send({ status: 200, message: allPost });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send({ status: 404, message: "post not found." });
        }

        const user = await User.findById(post.user);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        user.posts = user.posts.filer(postID => postID.toString() !== post._id.toString());
        await user.save();
        await post.deleteOne();
        await Comment.deleteMany({ post: post._id });

        res.send({ status: 200, message: "post deleted." });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send({ status: 404, message: "post not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (post.likes.includes(userId)) {
            res.send({ status: 404, message: "you have already liked this post." });
        }

        post.likes.push(userId);
        await post.save();

        res.send({ status: 200, message: "post liked." });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

const disLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send({ status: 404, message: "post not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (!post.likes.includes(userId)) {
            return res.send({ status: 404, message: "you have not liked this post." });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        res.send({ status: 200, message: "post disliked." });

    } catch (error) {
        res.send({ status: 500, message: "Data not found." });
        console.log(error);
    }
};

module.exports = {
    createPost,
    createPostWithImage,
    updatePost,
    getAllPost,
    getUserPost,
    deletePost,
    likePost,
    disLikePost
}