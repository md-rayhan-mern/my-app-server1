import express, { urlencoded } from "express";
import cors from "cors";
import { AppError } from "./src/utils/customAppError/customAppError.js";
import { corsOptions } from "./src/config/cors/corsOptions.js";
import { globalError } from "./src/middleware/globalMiddleware/globalMiddleware.js";

const app = express();
const PORT = process.env.PORT || 4000;
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

//all router
//app.use();

//404 route
app.all("*any", (req, res, next) => {
  next(new AppError(404, `Not found route ${req.originalUrl}`));
});

//global errorHandler
app.use(globalError);

//server start
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(
        `🚀  Database ready & Server runing: http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Database connection fail & Server can't runing:", error);
    process.exit(1);
  }
};
//server start
startServer();
