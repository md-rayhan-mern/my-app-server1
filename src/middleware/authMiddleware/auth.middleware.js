import { verifyAccessToken } from "../../utils/authUtilsJWT/auth.utils.js";
import { AppError } from "../../utils/customAppError/customAppError.js";
import { asyncWrapper } from "../../utils/asyncWrapper/asyncWrapper.js";

export const verifyJWT = asyncWrapper(async (req, res, next) => {
  // ১. ফ্রন্টএন্ড থেকে পাঠানো হেডার চেক করা (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized request: No token provided", 401);
  }
  // ২. "Bearer " বাদ দিয়ে শুধু টোকেনটি আলাদা করা
  const token = authHeader.split(" ")[1];
  // ৩. টোকেনটি আসল কি না এবং মেয়াদ আছে কি না তা যাচাই করা
  if (!token) {
    throw new AppError("Unauthorized request: No token provided", 401);
  }
  // ৩. টোকেন যাচাই করা (try-catch দিয়ে 401 এরর হ্যান্ডেল করা)
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    throw new AppError("Unauthorized request: Token expired or invalid", 401);
  }
  // ৪. টোকেনের ভেতরের তথ্য (id, role) req.user-এ সেট করা, যাতে পরের কন্ট্রোলার তা পায়
  req.user = decoded;
  // ৫. সব ঠিক থাকলে পরের ফাংশনে (কন্ট্রোলারে) যাওয়ার অনুমতি দেওয়া
  next();
});
