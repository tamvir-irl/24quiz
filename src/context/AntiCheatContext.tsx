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
      const sessionEnded = localStorage.getItem("sessionEnded");
      if (!sessionEnded) {
        setIsEliminated(true);
        localStorage.setItem("isEliminated", "true");
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

    // Handle window resize (screen split detection)
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const heightDifference = Math.abs(newHeight - initialHeight);
      const widthDifference = Math.abs(newWidth - initialWidth);

      // Detect if the keyboard is shown on mobile
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const isKeyboard = isMobile && heightDifference > 100 && widthDifference < 50;

      // Check for screen splitting (significant change in both width and height)
      const isScreenSplit = !isKeyboard && (widthDifference > 100 || heightDifference > 100);

      if (isScreenSplit) {
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
