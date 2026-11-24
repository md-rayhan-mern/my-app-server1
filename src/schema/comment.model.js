import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // নেস্টেড কমেন্ট (রিপ্লাই) সাপোর্ট করার জন্য
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    content: {
      type: String,
      required: [true, "Comment cannot be empty"],
      trim: true,
      maxlength: 1000,
    },
    // প্রতিটি রিঅ্যাকশন আলাদাভাবে দেখানোর জন্য আপডেট করা কাউন্টার
    reactionCounts: {
      like: { type: Number, default: 0, min: 0 },
      love: { type: Number, default: 0, min: 0 },
      haha: { type: Number, default: 0, min: 0 },
      wow: { type: Number, default: 0, min: 0 },
      sad: { type: Number, default: 0, min: 0 },
      angry: { type: Number, default: 0, min: 0 },
      total: { type: Number, default: 0, min: 0 }, // মোট কতজন রিঅ্যাক্ট দিয়েছে
    },
  },
  { timestamps: true },
);

// নির্দিষ্ট পোস্টের কমেন্ট দ্রুত লোড করার জন্য ইনডেক্স
commentSchema.index({ postId: 1, parentCommentId: 1, createdAt: 1 });

export const Comment = mongoose.model("Comment", commentSchema);
