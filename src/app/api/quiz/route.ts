import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Answer from "@/models/Answer";

export async function POST(request: Request) {
  try {
    const { quizId, answer, roll } = await request.json();

    if (!quizId || !roll) {
      return NextResponse.json({ error: "Missing quiz ID or roll" }, { status: 400 });
    }

    await connectToDatabase();

    // Save the answer to the database
    const newAnswer = new Answer({ quizId, answer: answer || null, roll });
    await newAnswer.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving answer:", error);
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
