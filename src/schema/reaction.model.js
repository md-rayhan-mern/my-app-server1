import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType", // ডায়নামিকভাবে Post বা Comment-কে রেফার করবে
    },
    targetType: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
    type: {
      type: String,
      required: true,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      default: "like",
    },
  },
  { timestamps: true },
);

// একজন ইউজার একটি পোস্ট/কমেন্টে একবারই রিঅ্যাক্ট দিতে পারবে
reactionSchema.index(
  { userId: 1, targetId: 1, targetType: 1 },
  { unique: true },
);

// নির্দিষ্ট পোস্ট বা কমেন্টের সব রিঅ্যাকশন দেখার জন্য ইনডেক্স
reactionSchema.index({ targetId: 1, targetType: 1 });

export const Reaction = mongoose.model("Reaction", reactionSchema);
