import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File path to store quiz answers
const filePath = path.join(process.cwd(), "data", "quizAnswers.json");

// Ensure the file exists
function ensureFileExists() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ answers: [] }, null, 2));
  }
}

// Load quiz answers from file
function loadQuizAnswers() {
  ensureFileExists();
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Save quiz answers to file
function saveQuizAnswers(answers: any) {
  fs.writeFileSync(filePath, JSON.stringify({ answers }, null, 2));
}

export async function POST(request: Request) {
  try {
    const { quizId, answer, roll } = await request.json();

    if (quizId === undefined || answer === undefined) {
      return NextResponse.json(
        { error: "Missing quiz ID or answer" },
        { status: 400 }
      );
    }

    const quizAnswers = loadQuizAnswers().answers;

    // Store the quiz answer
    quizAnswers.push({ quizId, answer, roll });

    // Save updated answers to file
    saveQuizAnswers(quizAnswers);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving answer:", error);
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
