import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "complaints"
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;
