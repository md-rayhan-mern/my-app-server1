import { verifyAccessToken } from "../../utils/authUtilsJWT/auth.utils.js";
import { AppError } from "../../utils/customAppError/customAppError.js";
export const verifyJWT = (req, res, next) => {
  try {
    // ১. ফ্রন্টএন্ড থেকে পাঠানো হেডার চেক করা (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized request: No token provided", 401);
    }
    // ২. "Bearer " বাদ দিয়ে শুধু টোকেনটি আলাদা করা
    const token = authHeader.split(" ")[1];
    // ৩. টোকেনটি আসল কি না এবং মেয়াদ আছে কি না তা যাচাই করা
    const decoded = verifyAccessToken(token);
    // ৪. টোকেনের ভেতরের তথ্য (id, role) req.user-এ সেট করা, যাতে পরের কন্ট্রোলার তা পায়
    req.user = decoded;
    // ৫. সব ঠিক থাকলে পরের ফাংশনে (কন্ট্রোলারে) যাওয়ার অনুমতি দেওয়া
    next();
  } catch (error) {
    // টোকেনের মেয়াদ শেষ (Expired) বা ভুল হলে 401 এরর পাঠাবে
    next(new AppError("Invalid or expired access token", 401));
  }
};
