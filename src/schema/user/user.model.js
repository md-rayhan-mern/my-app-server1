import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be either Male, Female or Other",
      },
      default: "Other",
    },
    profilePic: {
      type: String,
      default: "https://placeholder.com",
    },
    coverPhoto: {
      type: String,
      default: "",
    },
    friendsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    birthDate: {
      type: Date,
    },
    bio: {
      type: String,
      maxlength: 250,
      default: "",
    },
    // নতুন যোগ করা এড্রেস অংশ
    address: {
      addressType: {
        type: String,
        enum: {
          values: ["home", "office", "other"],
          message: "Address type must be either home, office, or other",
        },
        lowercase: true,
        default: "home",
        required: [true, "Address type is required"],
      },
      addressText: {
        type: String,
        required: [true, "Address text is required"],
        trim: true,
      },
    },
    refreshToken: { type: String, select: false }, // সেশন ভ্যালিডেশনের জন্য
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model("User", userSchema);
