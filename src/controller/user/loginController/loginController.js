import { asyncWrapper } from "../../../utils/asyncWrapper/asyncWrapper.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";
import { apiResponse } from "../../../utils/apiRespons/apiResponse.js";
import {
  loginService,
  refreshTokenService,
} from "../../../service/user/loginService/loginService.js";
import { User } from "../../../schema/user/userSchema.js";
// ১. কুকির নিরাপত্তা সেটিংস
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // লাইভ সার্ভারে (HTTPS) true হবে, লোকালহোস্টে false
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ক্রস-অরিজিন ও CSRF সুরক্ষা
  maxAge: 7 * 24 * 60 * 60 * 1000, // ৭ দিন মেয়াদ (মিলিসেকেন্ডে)
};
export const loginController = asyncWrapper(async (req, res, next) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    throw new AppError("Email/Phone and password are required", 400);
  }
  // সার্ভিস কল করে user এবং দুটি টোকেন নেওয়া হলো
  const { user, accessToken, refreshToken } = await loginService(
    identifier,
    password,
  );
  // refreshToken কুকিতে সেট করা হলো এবং রেসপন্সে user ও accessToken পাঠানো হলো

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new apiResponse(200, { user, accessToken }, "Success login"));
});
//refreshToken service (নতুন Access Token নেওয়ার জন্য)
export const refreshTokenController = asyncWrapper(async (req, res, next) => {
  // ব্রাউজার থেকে স্বয়ংক্রিয়ভাবে আসা HttpOnly কুকি থেকে টোকেন নেওয়া হলো
  const incomingRefreshToken = req.cookies?.refreshToken;
  // সার্ভিস কল করে নতুন জোড়া টোকেন নেওয়া হলো (Token Rotation)
  const { accessToken, refreshToken } =
    await refreshTokenService(incomingRefreshToken);
  // কুকিতে নতুন refreshToken আপডেট করা হলো এবং ফ্রন্টএন্ডে নতুন accessToken পাঠানো হলো
  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        200,
        { accessToken },
        "Access token refreshed successfully",
      ),
    );
});
//logout controller
export const logoutController = asyncWrapper(async (req, res, next) => {
  // ডেটাবেস থেকে ইউজারের refreshToken মুছে ফেলা (যদি verifyJWT মিডলওয়্যার থেকে req.user পাওয়া যায়)
  if (req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { refreshToken: 1 },
    });
  }
  // ব্রাউজারের কুকি মুছে ফেলা
  res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json(new apiResponse(200, null, "Logout successful"));
});
