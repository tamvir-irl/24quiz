import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { roll, nickname } = await request.json();
    await connectToDatabase();

    // Check if the user is already registered
    const existingUser = await User.findOne({ roll });
    if (existingUser) {
      return NextResponse.json({ alreadyRegistered: true });
    }

    // Register the new user
    const newUser = new User({ roll, nickname });
    await newUser.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
