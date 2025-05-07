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
  const [roll, setRoll] = useState<string | null>(null);
  const router = useRouter()
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

  useEffect(()=>{
    if(typeof window !== "undefined"){
      const r = localStorage.getItem("roll");
      setRoll(r);
    }
  }, [])

  const endSession = () => {
    setIsSessionEnded(true);
    localStorage.setItem("sessionEnded", "true"); // Mark session as ended
    alert("Your session has ended!");
  };

  const handleSubmit = async () => {
    const answer = selectedAnswer || textAnswer || null;
  
    try {
      // Send the answer to the server
      const response = await fetch(`https://ruetcse24quiz/api/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answer: answer,
          roll: roll
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(`Error: ${result.error}`);
        return;
      }
  
      // Mark the quiz as answered
      if (typeof window !== "undefined") {
        localStorage.setItem(`answeredQuiz${quiz.id}`, "true");
      }
  
      // Move to the next quiz
      const nextQuizIndex = currentQuizIndex + 1;
      if (nextQuizIndex < quizes.length) {
        setCurrentQuizIndex(nextQuizIndex);
        setSelectedAnswer(null);
        setTextAnswer("");
        setIsAnswered(false);
      } else {
        alert("You have completed all quizzes!");
        setIsSessionEnded(true);
        localStorage.setItem("sessionEnded", "true");
        router.push("/credits");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      //alert("An error occurred while submitting the answer.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ans = localStorage.getItem(`answeredQuiz${quiz.id}`) === "true";
      setIsAnswered(ans);
    }
  }, [quiz.id]); // Depend on quiz.id to update when the quiz changes
  if (isEliminated) {
    return (
      <div className="p-4 w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">You have been eliminated!</h1>
      </div>
    );
  }
  if (isSessionEnded) {
    setTimeout(()=>{
        router.push("/credits")
    }, 2000);
    return (
      <div className="p-4 w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Your quiz session has ended!</h1>
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
            <div className="mb-4" dangerouslySetInnerHTML={{ __html: textPart }} />
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
