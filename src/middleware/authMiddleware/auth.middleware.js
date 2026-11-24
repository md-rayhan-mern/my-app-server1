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
  req.user = {
    ...decoded,
    _id: decoded._id || decoded.id || decoded.userId,
  };
  // ৫. সব ঠিক থাকলে পরের ফাংশনে (কন্ট্রোলারে) যাওয়ার অনুমতি দেওয়া
  next();
});

// src/middlewares/authMiddleware/auth.middleware.js

export const optionalVerifyJWT = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ১. হেডারে টোকেন না থাকলে সে আসলেই Guest User -> কোনো এরর ছাড়াই সামনে যেতে দেবে
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  // ২. "Bearer " বাদ দিয়ে আসল টোকেনটি নেওয়া ([1] দেওয়া জরুরি)
  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }

  // ৩. হেডারে টোকেন থাকলে সেটি অবশ্যই ভ্যালিড হতে হবে।
  // মেয়াদ শেষ হলে 401 এরর দেবে যাতে আপনার Axios Interceptor Refresh Token দিয়ে নতুন টোকেন নিতে পারে!
  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id || decoded.userId,
    };
    next();
  } catch (error) {
    throw new AppError("Unauthorized request: Token expired or invalid", 401);
  }
});
