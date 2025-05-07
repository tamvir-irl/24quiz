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
      <h1 className="text-center mt-4 text-2xl">Welcome to RUET kiddos!</h1>
      <p className="text-center mt-4 text-xl">
        This is a short quiz game! Answer them all correctly and your senior Imran Hasan will give you a treat!!
        <br />
        (Valid Until 3 PM)
      </p>
      <div className="w-full h-screen flex justify-center items-center p-4">
        <Card className="w-full max-w-lg -mt-40">
          <CardHeader className="font-bold text-xl">Credits</CardHeader>
          <CardContent>
            <span className="font-semibold">Website Design & Development:</span>
            <br />
            <span>Tamvir {"(˶˃ ᵕ ˂˶)"}</span>
            <br />
            <span className="font-semibold">Quizes</span>
            <br />
            <span>Imran Hasan and Tamvir</span>
          </CardContent>
          <CardFooter className="flex justify-end">
            
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
