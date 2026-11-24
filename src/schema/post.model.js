import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
  },
  { _id: false }, // সাব-ডকুমেন্টের জন্য আলাদা _id দরকার নেই
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    media: [mediaSchema],
    privacy: {
      type: String,
      enum: ["public", "friends", "only_me"],
      default: "friends",
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
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

// নিউজফিডে ইউজারের পোস্ট সময় অনুযায়ী দ্রুত লোড করার জন্য Compound Index
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ privacy: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
