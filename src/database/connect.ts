import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let isConnected = false;

export default async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    // console.log(MONGODB_URI)
    await mongoose.connect(MONGODB_URI!);
    isConnected = true;
    // console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}