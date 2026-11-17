import bcrypt from "bcrypt";
import { User } from "../../../schema/user/userSchema.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";
import {
  generateTokens,
  verifyRefreshToken,
} from "../../../utils/authUtilsJWT/auth.utils.js";

//login servis
export const loginService = async (identifier, password) => {
  if (!identifier || !password) {
    throw new AppError("Email/Phone and password are required", 400);
  }
  const cleanIdentifier = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }],
  }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }
  const { accessToken, refreshToken } = generateTokens(user);

  // ৪. ডেটাবেসে Refresh Token সেভ রাখা
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

//refreshToken service
export const refreshTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new AppError("Refresh token is required", 401);
  }
  // ১. টোকেন ভেরিফাই করা
  let decoded;

  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 403);
  }
  // ২. ডেটাবেস থেকে ইউজার ও তার সেভ করা refreshToken খুঁজে বের করা
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  // ৩. Token Reuse Detection (হ্যাকার পুরনো চুরি করা টোকেন ব্যবহার করলে সব সেশন বাতিল)
  if (user.refreshToken !== incomingRefreshToken) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      "Security alert: Session invalidated. Please login again.",
      403,
    );
  }
  // ৪. নতুন জোড়া টোকেন তৈরি এবং ডেটাবেস আপডেট (Token Rotation)
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
