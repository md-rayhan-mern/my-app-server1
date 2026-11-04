import express, { urlencoded } from "express";

const app = express();
const PORT = process.env.PORT || 4000;
app.use(
  express.json({
    limit: "50kb",
    strict: true,
    inflate: true,
    type: ["application/json", "text/plain"],
    verify: (req, res, buf, encoding) => {},
  }),
);
app.use(urlencoded({ extended: true, limit: "50kb" }));

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
