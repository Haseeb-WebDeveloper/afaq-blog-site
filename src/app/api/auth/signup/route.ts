import { NextResponse } from "next/server";
import connectDB from "@/database/connect";
import Admin from "@/database/models/admin.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if(!name || !email || !password){
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
          );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Check if this is the first admin
    const adminCount = await Admin.countDocuments();
    if (adminCount > 2) {
      return NextResponse.json(
        { error: "Only one admin account is allowed" },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    });

    return NextResponse.json(
      {
        message: "Admin account created successfully",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 