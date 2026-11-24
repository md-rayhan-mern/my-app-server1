import mongoose from "mongoose";
import { Comment } from "../schema/comment.model.js";
import { Post } from "../schema/post.model.js";
import { Notification } from "../schema/notification.model.js";
import { AppError } from "../utils/customAppError/customAppError.js";

class CommentService {
  // ১. সরাসরি পোস্টে কমেন্ট বা কমেন্টের রিপ্লাই তৈরি করা
  async createComment({ userId, postId, content, parentCommentId = null }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const post = await Post.findById(postId).session(session);
      if (!post) {
        throw new AppError("Post not found.", 404);
      }

      let parentComment = null;
      if (parentCommentId) {
        parentComment =
          await Comment.findById(parentCommentId).session(session);
        if (!parentComment) {
          throw new AppError("Parent comment not found.", 404);
        }
      }

      // কমেন্ট তৈরি
      const [newComment] = await Comment.create(
        [
          {
            postId,
            author: userId,
            content,
            parentCommentId: parentCommentId || null,
          },
        ],
        { session },
      );

      // পোস্টের মোট commentsCount ১ বাড়ানো
      await Post.findByIdAndUpdate(
        postId,
        { $inc: { commentsCount: 1 } },
        { session },
      );

      // নোটিফিকেশন পাঠানো (নিজের পোস্ট বা কমেন্ট না হলে)
      const recipientId = parentComment ? parentComment.author : post.author;
      if (!recipientId.equals(userId)) {
        await Notification.create(
          [
            {
              recipient: recipientId,
              sender: userId,
              type: parentComment ? "reply" : "comment", // রিপ্লাই হলে "reply", নাহলে "comment"
              postId,
            },
          ],
          { session },
        );
      }

      await session.commitTransaction();
      return await newComment.populate("author", "name email profilePic");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // ২. পোস্টের মূল কমেন্ট বা কোনো কমেন্টের রিপ্লাই দেখা
  async getComments({ postId, parentCommentId = null }) {
    const comments = await Comment.find({
      postId,
      parentCommentId: parentCommentId || null,
    })
      .populate("author", "name email profilePic")
      .sort({ createdAt: 1 }); // আপনার ইনডেক্স অনুযায়ী পুরনো থেকে নতুন (1) সাজানো হলো

    return comments;
  }
}

export const commentService = new CommentService();
