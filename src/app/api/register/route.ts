import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File path to store registered users
const filePath = path.join(process.cwd(), "data", "registeredUsers.json");

// Ensure the file exists
function ensureFileExists() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ users: [] }, null, 2));
  }
}

// Load registered users from file
function loadRegisteredUsers(): string[] {
  ensureFileExists();
  const data = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(data);
  return parsed.users;
}

// Save registered users to file
function saveRegisteredUsers(users: string[]) {
  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2));
}

// Handle POST request
export async function POST(request: Request) {
  try {
    const { roll, nickname } = await request.json();

    if (!roll || !nickname) {
      return NextResponse.json(
        { error: "Missing roll number or nickname" },
        { status: 400 }
      );
    }

    const registeredUsers = loadRegisteredUsers();

    // Check if the user is already registered
    if (registeredUsers.includes(roll)) {
      return NextResponse.json({ alreadyRegistered: true });
    }

    // Register the user
    registeredUsers.push(roll);
    saveRegisteredUsers(registeredUsers);

    return NextResponse.json({ alreadyRegistered: false });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
