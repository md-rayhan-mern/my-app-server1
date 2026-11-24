import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["like", "comment", "reply", "friend_request", "friend_accept"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// ইউজারের আনরিড বা সাম্প্রতিক নোটিফিকেশন দ্রুত আনার জন্য
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
