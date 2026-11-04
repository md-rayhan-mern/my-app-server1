import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const URI =
      process.env.MONGO_URI || "mongodb://localhost:27017/my_database";
    await mongoose.connect(URI);
    const currentMode = process.env.NODE_ENV || "development";
    console.log(`📡 Database connected successfully | Mode: ${currentMode}`);
  } catch (error) {
    console.error(`❌ Database connection fail: ${error.message}`);
    process.exit(1);
  }
};
