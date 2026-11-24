import mongoose from "mongoose";
import { Post } from "../schema/post.model.js";
import { Friendship } from "../schema/friendship.model.js";
import { AppError } from "../utils/customAppError/customAppError.js";

class PostService {
  // নতুন পোস্ট তৈরি করার সার্ভিস
  async createPost({ author, content, media, privacy }) {
    // লেখা বা মিডিয়া (ছবি/ভিডিও) কোনোটিই না থাকলে এরর থ্রো করবে
    if (!content?.trim() && (!media || media.length === 0)) {
      throw new AppError(
        "পোস্টে অবশ্যই কিছু লেখা অথবা ছবি/ভিডিও থাকতে হবে।",
        400,
      );
    }
    const post = await Post.create({ author, content, media, privacy });
    // পোস্ট তৈরি হওয়ার পর পোস্টদাতার নাম ও ছবি যুক্ত করে রিটার্ন করবে
    return await post.populate("author", "name profilePic");
  }

  // হোম নিউজফিড জেনারেট করার সার্ভিস (Aggregation Pipeline)
  // src/service/post.service.js

  async getNewsFeed({ userId = null, cursor = null, limit = 10 }) {
    let matchCondition = { privacy: "public" };
    let currentUserId = null;

    if (userId) {
      currentUserId = new mongoose.Types.ObjectId(userId);
      const friendships = await Friendship.find({
        $or: [{ requester: currentUserId }, { recipient: currentUserId }],
        status: "accepted",
      })
        .select("requester recipient")
        .lean();

      const friendIds = friendships.map((f) =>
        f.requester.equals(currentUserId) ? f.recipient : f.requester,
      );
      friendIds.push(currentUserId);

      matchCondition = {
        $or: [
          {
            author: { $in: friendIds },
            privacy: { $in: ["public", "friends"] },
          },
          { privacy: "public" },
        ],
      };
    }

    // কার্সর থাকলে তার আগের পোস্টগুলো ফিল্টার করা (Lazy Loading)
    if (cursor) {
      matchCondition.createdAt = { $lt: new Date(cursor) };
    }

    // আরও পোস্ট আছে কি না তা বোঝার জন্য limit + 1 টা ডাটা আনা
    const posts = await Post.aggregate([
      { $match: matchCondition },
      { $sort: { createdAt: -1 } },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { name: 1, profilePic: 1 } }],
        },
      },
      { $unwind: "$author" },
      ...(currentUserId
        ? [
            {
              $lookup: {
                from: "reactions",
                let: { postId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$targetId", "$$postId"] },
                          { $eq: ["$userId", currentUserId] },
                          { $eq: ["$targetType", "Post"] },
                        ],
                      },
                    },
                  },
                ],
                as: "userReaction",
              },
            },
            {
              $addFields: {
                userReaction: {
                  $ifNull: [{ $arrayElemAt: ["$userReaction.type", 0] }, null],
                },
              },
            },
          ]
        : [{ $addFields: { userReaction: null } }]),
    ]);

    // চেক করা আরও পোস্ট বাকি আছে কি না
    const hasMore = posts.length > limit;
    if (hasMore) posts.pop(); // বাড়তি ১টি পোস্ট বাদ দেওয়া

    // পরবর্তী রিকোয়েস্টের জন্য শেষ পোস্টের সময়টি কার্সর হিসেবে সেট করা
    const nextCursor =
      posts.length > 0 ? posts[posts.length - 1].createdAt : null;

    return { posts, nextCursor, hasMore };
  }
}

export const postService = new PostService();
