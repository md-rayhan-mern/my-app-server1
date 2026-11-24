import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// একই ইউজারকে ডুপ্লিকেট রিকোয়েস্ট পাঠানো আটকাতে Compound Unique Index
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// দ্রুত ফ্রেন্ড লিস্ট খুঁজে পাওয়ার জন্য ইনডেক্স
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index({ requester: 1, status: 1 });

export const Friendship = mongoose.model("Friendship", friendshipSchema);
