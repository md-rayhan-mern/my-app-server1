import { AppError } from "../../utils/customAppError/customAppError.js";
const allowOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4000",
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new AppError(
          403,
          "CORS পলিসির কারণে এই অরিজিন থেকে অ্যাক্সেস অনুমোদিত নয়!",
        ),
      );
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};
