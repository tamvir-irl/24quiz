"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useContext } from "react";
import BlockMath from "@matejmazur/react-katex";
import InlineMath from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { quizes } from "@/lib/quizes"; // Adjust the path if needed
import { AntiCheatContext } from "@/context/AntiCheatContext";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { isEliminated } = useContext(AntiCheatContext);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(999); // Timer state
  const [isSessionEnded, setIsSessionEnded] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0); // Track current quiz
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const router = useRouter();
  const quiz = quizes[currentQuizIndex]; // Get current quiz based on index

  useEffect(() => {
    const sessionStatus = localStorage.getItem("sessionEnded");
    if (sessionStatus === "true") {
      setIsSessionEnded(true);
    } else {
      setTimeLeft(quiz.time); // Start the timer based on the quiz time
    }
  }, [quiz.time, currentQuizIndex]);
  
  useEffect(() => {
    if (timeLeft === 0) {
      endSession();
    } else {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1000);
      }, 1000);

      return () => clearInterval(timerId); // Clean up interval on unmount
    }
  }, [timeLeft]);


  // Check if the question has already been answered on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ans = localStorage.getItem(`answered${quiz.id}`) === "true";
      setIsAnswered(ans);
    }
  }, [quiz.id]);

  const endSession = () => {
    setIsSessionEnded(true);
    localStorage.setItem("sessionEnded", "true"); // Mark session as ended
    alert("Your session has ended!");
  };

  const handleSubmit = async () => {
    try {
      const roll = localStorage.getItem("roll");

      if (!roll) {
        alert("User is not registered!");
        return;
      }

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          answer: selectedAnswer || textAnswer || "null",
          roll: roll,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Mark the quiz as answered in localStorage
        localStorage.setItem(`answered${quiz.id}`, "true");
        setIsAnswered(true);

        // Move to the next quiz
        const nextQuizIndex = currentQuizIndex + 1;
        if (nextQuizIndex < quizes.length) {
          setCurrentQuizIndex(nextQuizIndex);
          setSelectedAnswer("null");
          setTextAnswer("");
        } else {
          alert("You have completed all quizzes!");
          localStorage.setItem("sessionEnded", "true");
          router.push("/credits");
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed, please try again.");
    }
  };
  if (isSessionEnded) {
    setTimeout(() => {
      router.push("/credits");
    }, 2000);
    return (
      <div className="p-4 w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Your quiz session has ended!</h1>
      </div>
    );
  }
  if (isEliminated) {
    return (
      <div className="p-4 w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">You have been eliminated!</h1>
      </div>
    );
  }

  

  if (isAnswered) {
    return (
      <div className="p-4 w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-gray-500">
          You have already answered this quiz.
        </h1>
      </div>
    );
  }

  const [textPart, mathPart] = quiz.question.split("\n").reduce(
    (acc, line) => {
      if (line.startsWith("(x-")) {
        acc[1] = line; // Math part
      } else {
        acc[0] += line + "<br />"; // Text part
      }
      return acc;
    },
    ["", ""]
  );

  return (
    <div className="p-4 w-full h-screen">
      <h1 className="text-center mt-4 text-2xl">RUET CSE Quiz Game</h1>
      <div className="w-full h-screen flex justify-center items-center p-4">
        <Card className="w-full max-w-lg -mt-40">
          <CardHeader className="flex justify-between">
            <div>Quiz {quiz.id}</div>
            <div className="text-sm text-gray-500">
              {new Date(timeLeft).toISOString().substr(14, 5)}{" "}
              {/* Timer format */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: textPart }}
              />
              {mathPart && <BlockMath>{mathPart}</BlockMath>}
            </div>
            {quiz.options.map((option, index) => (
              <div key={index} className="mb-2">
                {option.type === "radio" ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quiz-option"
                      value={option.value}
                      checked={selectedAnswer === option.value}
                      onChange={() => setSelectedAnswer(option.value)}
                    />
                    <InlineMath>{option.label}</InlineMath>
                  </label>
                ) : (
                  <div>
                    <label className="font-semibold">{option.label}</label>
                    <br />
                    <Input
                      type="text"
                      placeholder={option.placeholder || ""}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
