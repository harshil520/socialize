const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const createComment = async (req, res) => {
    try {
        const { postId, userId, text } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.send({ status: 404, message: "post not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const comment = new Comment({
            user: userId,
            post: postId,
            text
        });

        await comment.save();
        post.comments.push(comment._id);
        await post.save();

        res.send({ status: 201, message: "comment added.", data: comment });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const replyComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId, text } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const reply = {
            text,
            user: userId
        }

        await comment.replies.push(reply);
        await comment.save();

        res.send({ status: 201, message: "comment reply added.", data: reply });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        const updateComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });

        res.send({ status: 200, message: "comment updated.", data: updateComment });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const updateReplyComment = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const { text, userId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        const replyIndex = comment.replies.findIndex((reply) => reply._id.toString() === replyId);
        if (replyIndex == -1) {
            return res.send({ status: 404, message: "comment reply not found." });
        }

        if (comment.replies[replyIndex].user.toString() !== userId) {
            return res.send({ status: 404, message: "You can only able to updae your own comments." });
        }

        comment.replies[replyIndex].text = text;
        await comment.save();

        res.send({ status: 200, message: "comment reply updated.", data: comment.replies[replyIndex] });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const getPostComment = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send({ status: 404, message: "post not found." });
        }

        let comments = await Comment.find({ post: postId });

        for (const comment of comments) {
            await comment.populate("user", "userName fullName profilePicture");
            if (comment.replies.length > 0) {
                await comment.populate("replies.user", "userName fullName profilePicture");
            }
        }

        res.send({ status: 200, message: "comments found.", data: comments });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        await Post.findOneAndUpdate(
            { comments: commentId },
            { $pull: { comments: commentId } },
            { new: true }
        );

        await comment.deleteOne();


        res.send({ status: 200, message: "comment deleted." });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const deleteReplyComment = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        comment.replies = comment.replies.filter((id) => {
            id.toString() !== replyId
        });

        await comment.save();

        res.send({ status: 200, message: "comment reply deleted." });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (comment.likes.includes(userId)) {
            return res.send({ status: 400, message: "You already like comment." });
        }

        comment.likes.push(userId);
        await comment.save();

        res.send({ status: 200, message: "comment liked." });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const disLikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        if (!comment.likes.includes(userId)) {
            return res.send({ status: 400, message: "You have not like comment." });
        }

        comment.likes = comment.likes.filter(id => id.toString() !== userId);
        await comment.save();

        res.send({ status: 200, message: "comment disliked." });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const likeReplyComment = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const replyComment = comment.replies.id(replyId);
        if (!replyComment) {
            return res.send({ status: 404, message: "reply not found." });
        }

        if (replyComment.likes.includes(userId)) {
            return res.send({ status: 400, message: "You already like reply comment." });
        }

        replyComment.likes.push(userId);
        await comment.save();

        res.send({ status: 200, message: "reply comment liked." });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

const disLikeReplyComment = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.send({ status: 404, message: "comment not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({ status: 404, message: "user not found." });
        }

        const replyComment = comment.replies.id(replyId);
        if (!replyComment) {
            return res.send({ status: 404, message: "reply not found." });
        }

        if (!replyComment.likes.includes(userId)) {
            return res.send({ status: 400, message: "You have not like reply comment." });
        }

        replyComment.likes = replyComment.likes.filter(id => id.toString() !== userId);
        await comment.save();

        res.send({ status: 200, message: "reply comment disliked." });

    } catch (error) {
        res.send({ status: 500, message: "Internal server error." });
        console.log(error);
    }
}

module.exports = {
    createComment, replyComment, updateComment, updateReplyComment,
    getPostComment, deleteComment, deleteReplyComment, likeComment,
    disLikeComment, likeReplyComment, disLikeReplyComment
};