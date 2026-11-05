import mongoose from "mongoose";
//paponk25_db_user
//L4DoRBUiCHGPtbtq
export const connectDB = async () => {
  try {
    const URI =
      process.env.DATABASE_URL || "mongodb://localhost:27017/my_database";
    await mongoose.connect(URI);
    const currentMode = process.env.NODE_ENV || "development";
    console.log(
      `📡 Database connected successfully | Mode: ${currentMode} | Name: ${mongoose.connection.name}`,
    );
  } catch (error) {
    console.error(`❌ Database connection fail: ${error.message}`);
    process.exit(1);
  }
};
