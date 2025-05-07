"use client";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AntiCheatContextType {
  isEliminated: boolean;
}

export const AntiCheatContext = createContext<AntiCheatContextType>({
  isEliminated: false,
});

export const AntiCheatProvider = ({ children }: { children: ReactNode }) => {
  const [isEliminated, setIsEliminated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if eliminated state exists in localStorage
    const eliminated = localStorage.getItem("isEliminated") === "true";
    setIsEliminated(eliminated);

    // Store the initial window size
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    // Eliminate the user and redirect
    const eliminateUser = () => {
      const sessionEnded = localStorage.getItem("sessionEnded")
      if(!sessionEnded){
        setIsEliminated(true);
        localStorage.setItem("isEliminated", "true");
        //alert("You have been eliminated for violating the rules!");
        router.push("/credits");
      }
    };

    // Handle focus and visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState !== "visible") {
        eliminateUser();
      }
    };

    // Handle window blur (switching apps or tabs)
    const handleBlur = () => {
      eliminateUser();
    };

    // Handle window resize (screen size or splitting)
    const handleResize = () => {
      if (window.innerWidth !== initialWidth || window.innerHeight !== initialHeight) {
        eliminateUser();
      }
    };

    // Activate anti-cheat logic only on quiz pages
    if (pathname.startsWith("/quiz/")) {
      // Attach event listeners for anti-cheat logic
      window.addEventListener("blur", handleBlur);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("resize", handleResize);
    }

    // Clean up when component unmounts or path changes
    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [router, pathname]);

  return (
    <AntiCheatContext.Provider value={{ isEliminated }}>
      {children}
    </AntiCheatContext.Provider>
  );
};
