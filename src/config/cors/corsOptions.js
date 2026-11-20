import { AppError } from "../../utils/customAppError/customAppError.js";
// ১. .env থেকে সব লিংক কমা দিয়ে আলাদা করে স্পেস (.trim) মুছে নেওয়া হলো
const allOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((url) =>
  url.trim(),
) || ["http://localhost:5173", "https://my-app-front1.vercel.app"];
// ২. কন্ডিশন: প্রোডাকশন (Render) হলে শুধুমাত্র https (লাইভ) লিংকগুলো নেবে, আর লোকালে সব নেবে
const allowOrigins =
  process.env.NODE_ENV === "production"
    ? allOrigins.filter((url) => url.startsWith("https://"))
    : allOrigins;

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new AppError(
          "CORS পলিসির কারণে এই অরিজিন থেকে অ্যাক্সেস অনুমোদিত নয়!",
          403,
        ),
      );
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};
