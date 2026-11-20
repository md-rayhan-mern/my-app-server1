import { asyncWrapper } from "../../../utils/asyncWrapper/asyncWrapper.js";
import { apiResponse } from "../../../utils/apiRespons/apiResponse.js";
import { AppError } from "../../../utils/customAppError/customAppError.js";
import { userCreateService } from "../../../service/user/userCreateService/userCreateService.js";
// ১. কুকির নিরাপত্তা সেটিংস
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // লাইভ সার্ভারে (HTTPS) true হবে, লোকালহোস্টে false
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ক্রস-অরিজিন ও CSRF সুরক্ষা
  maxAge: 7 * 24 * 60 * 60 * 1000, // ৭ দিন মেয়াদ (মিলিসেকেন্ডে)
};
export const userCreateController = asyncWrapper(async (req, res, next) => {
  const { name, email, phone, password, address } = req.body;
  const userData = {
    name,
    email,
    phone,
    password,
    address,
  };
  if (!name || !email || !phone || !password || !address?.addressText) {
    return next(
      new AppError(
        "Name, email, phone, address, and password are required",
        400,
      ),
    );
  }
  const { user, accessToken, refreshToken } = await userCreateService(userData);
  // কুকিতে নতুন refreshToken আপডেট করা হলো এবং ফ্রন্টএন্ডে নতুন accessToken পাঠানো হলো
  res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        201,
        { user, accessToken },
        "User registered and logged in successfully! test server",
      ),
    );
});
