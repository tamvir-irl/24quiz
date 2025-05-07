import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";


export default function Home() {
  return (
    <div className="p-4 w-full h-screen">
      <h1 className="text-center mt-4 text-2xl">Welcome to RUET CSE kiddos!</h1>
      <p className="text-center mt-4 text-xl">
        This is a short quiz game! Answer them all correctly and your senior Imran Hasan will give you a treat!!
        <br />
        (Valid Until 3 PM)
      </p>
      <div className="w-full h-screen flex justify-center items-center p-4">
        <Card className="w-full max-w-lg -mt-40">
          <CardHeader>Rules</CardHeader>
          <CardContent>
            <ul>
                <li className="flex flex-row bg-violet-100 rounded mb-2"> <span className="w-[2px] p-[2px] bg-violet-500 rounded-full mr-2"></span><span className="p-2">This is a timed quiz, so think fast! Each question can have different time limit.</span></li>
                <li className="flex flex-row bg-red-100 rounded mb-2"> <span className="w-[2px] p-[2px] bg-red-400 rounded-full mr-2"></span><span className="p-2 font-semibold ">This quiz has anti cheat system. Minimizing the window, changing window, switching tab or even splitting screen are monitored. This is all for fun, so keep the fun up okay? <span className="text-lg italic">Cheating will lead to elimination :3 Disabling notifications is recommended.</span></span></li>
                <li className="flex flex-row bg-yellow-100 rounded mb-2"> <span className="w-[2px] p-[2px] bg-yellow-500 rounded-full mr-2"></span><span className="p-2">If you fail to answer a question within time, your quiz session will end. Meaning, you can&apos;t proceed to next one.</span></li>
                <li className="flex flex-row bg-blue-100 rounded mb-2"> <span className="w-[2px] p-[2px] bg-blue-500 rounded-full mr-2"></span><span className="p-2">You can go to the next quiz without answering the current one. However, once you do that, you can&apos;t answer that quiz again.</span></li>
                <li className="flex flex-row bg-green-100 rounded mb-2"> <span className="w-[2px] p-[2px] bg-green-500 rounded-full mr-2"></span><span className="p-2">All the best ^^</span></li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href={"/quiz/1"}><Button>Agree & Proceed</Button></Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
