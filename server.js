import express, { urlencoded } from "express";
import dns from "node:dns";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppError } from "./src/utils/customAppError/customAppError.js";
import { corsOptions } from "./src/config/cors/corsOptions.js";
import { mainRoute } from "./src/all-routes/mainRoute.js";
import { globalError } from "./src/middleware/globalMiddleware/globalMiddleware.js";
import { connectDB } from "./src/config/DB/connectionDB.js";

const app = express();
// শুধুমাত্র লোকাল কম্পিউটারে কাস্টম DNS চালু থাকবে, লাইভ সার্ভারে (Render) নয়
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}
const PORT = process.env.PORT || 4000;
// প্রোডাকশনে প্রক্সি ট্রাস্ট করার জন্য (কুকি ও রেট-লিমিটারের জন্য জরুরি)
app.set("trust proxy", 1);
app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "50kb",
    strict: true,
    inflate: true,
    type: ["application/json", "text/plain"],
  }),
);
app.use(urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

// রুট রাউট (সার্ভার লাইভ আছে কিনা দেখার জন্য)
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Server is running smoothly!" });
});
//all router
app.use("/", mainRoute);

//404 route
app.all("*any", (req, res, next) => {
  next(new AppError(`Not found route ${req.originalUrl}`, 404));
});

//global errorHandler
app.use(globalError);

//server start
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀  Database ready & Server runing: http://localhost:${PORT}`,
      );
    });

    // পোর্ট ব্লক বা অন্য কোনো সার্ভার এরর ক্যাচ করার জন্য
    server.on("error", (error) => {
      console.error("❌ Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Database connection fail & Server can't runing:", error);
  }
};
//server start
startServer();
