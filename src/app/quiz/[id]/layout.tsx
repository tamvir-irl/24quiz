import { AntiCheatProvider } from "@/context/AntiCheatContext";

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntiCheatProvider>
      {children}
    </AntiCheatProvider>
  );
}
