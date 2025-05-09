"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Import the Loader2 spinner

export default function Login() {
  const [roll, setRoll] = useState("");
  const [nickname, setNickname] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  // Check registration status on mount
  useEffect(() => {
    const savedRoll = localStorage.getItem("roll");
    const savedNickname = localStorage.getItem("nickname");

    if (savedRoll && savedNickname) {
      setIsRegistered(true);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll || !nickname) {
      alert("Please enter both roll number and nickname!");
      return;
    }

    setIsLoading(true); // Start loading state
    try {
      console.log(roll, nickname);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roll, nickname }),
      });

      const data = await response.json();

      if (data.alreadyRegistered) {
        alert("You have already registered from a different device!");
        router.push("/credits");
        localStorage.setItem("roll", roll);
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("sessionEnded", "true");
        setIsRegistered(true);
        return;
      }

      // Save to localStorage if registration is successful
      localStorage.setItem("roll", roll);
      localStorage.setItem("nickname", nickname);
      setIsRegistered(true);
      router.push("/warning");
    } catch (error) {
      alert("An error occurred while checking registration.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading state after the operation
    }
  };

  return (
    <div className="w-full h-screen">
      <h1 className="text-center mt-4 text-2xl">RUET CSE Quiz - Register</h1>
      <div className="w-full h-full flex justify-center items-center p-4">
        <Card className="w-full max-w-lg -mt-40">
          <CardHeader>Registration</CardHeader>
          {isRegistered ? (
            <CardContent>
              <h1 className="text-center text-lg font-semibold mb-4 text-green-500">
                You have already registered!
              </h1>
              <Button onClick={() => router.push("/warning")}>Proceed</Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent>
                <h1 className="font-semibold mb-2">Student Roll</h1>
                <Input
                  type="text"
                  placeholder="Enter your Roll"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  required
                />
                <br />
                <h1 className="font-semibold mb-2">Student Nickname</h1>
                <Input
                  type="text"
                  placeholder="Enter your nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </CardContent>
              <br />
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}> 
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Register"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
      <footer className="w-full h-1/6 flex justify-center items-center bg-black text-white">
        <span>
          Website designed and developed by Tamvir {"(˶˃ ᵕ ˂˶)"}
        </span>
      </footer>
    </div>
  );
}
