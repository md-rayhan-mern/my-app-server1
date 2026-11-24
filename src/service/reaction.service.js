import mongoose from "mongoose";
import { Reaction } from "../schema/reaction.model.js";
import { Post } from "../schema/post.model.js";
import { Comment } from "../schema/comment.model.js";
import { Notification } from "../schema/notification.model.js";
import { AppError } from "../utils/customAppError/customAppError.js";

class ReactionService {
  async toggleReaction({ userId, targetId, targetType, type }) {
    const validTypes = ["like", "love", "haha", "wow", "sad", "angry"];
    if (!validTypes.includes(type)) {
      throw new AppError("Invalid reaction type.", 400);
    }
    const TargetModel = targetType === "Post" ? Post : Comment;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const targetDoc = await TargetModel.findById(targetId).session(session);
      if (!targetDoc) {
        throw new AppError(`${targetType} not found.`, 404);
      }
      const existingReaction = await Reaction.findOne({
        userId,
        targetId,
        targetType,
      }).session(session);

      let updateQuery = {};
      let currentReaction = null;

      if (!existingReaction) {
        // নতুন রিঅ্যাক্ট যোগ করা
        await Reaction.create([{ userId, targetId, targetType, type }], {
          session,
        });
        updateQuery = {
          $inc: {
            [`reactionCounts.${type}`]: 1,
            "reactionCounts.total": 1,
          },
        };
        currentReaction = type;
        // নিজের পোস্টে নিজে রিঅ্যাক্ট না দিলে নোটিফিকেশন তৈরি করা
        if (!targetDoc.author.equals(userId)) {
          await Notification.create(
            [
              {
                recipient: targetDoc.author,
                sender: userId,
                type: "like",
                postId: targetType === "Post" ? targetId : targetDoc.postId,
              },
            ],
            { session },
          );
        }
      } else if (existingReaction.type === type) {
        // রিঅ্যাক্ট তুলে নেওয়া (Undo)
        await Reaction.deleteOne({ _id: existingReaction._id }).session(
          session,
        );
        updateQuery = {
          $inc: {
            [`reactionCounts.${type}`]: -1,
            "reactionCounts.total": -1,
          },
        };
        currentReaction = null;
      } else {
        // রিঅ্যাক্ট পরিবর্তন করা (Switch)
        const oldType = existingReaction.type;
        existingReaction.type = type;
        await existingReaction.save({ session });

        updateQuery = {
          $inc: {
            [`reactionCounts.${oldType}`]: -1,
            [`reactionCounts.${type}`]: 1,
          },
        };

        currentReaction = type;
      }
      const updatedTarget = await TargetModel.findByIdAndUpdate(
        targetId,
        updateQuery,
        { new: true, session },
      ).select("reactionCounts");

      await session.commitTransaction();

      return {
        reactionCounts: updatedTarget.reactionCounts,
        userReaction: currentReaction,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error; // asyncHandler এটি ধরে গ্লোবাল এরর মিডলওয়্যারে পাঠাবে
    } finally {
      session.endSession();
    }
  }
}

export const reactionService = new ReactionService();
