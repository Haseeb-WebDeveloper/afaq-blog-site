import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://haseebahmadrazakhan:hT7NNXWQucLDUwnY@cluster0.jvrm4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let isConnected = false;

export default async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}