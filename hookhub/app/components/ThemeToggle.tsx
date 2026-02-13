"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useLayoutEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Use useLayoutEffect to synchronously update before paint
  // This prevents hydration mismatch by ensuring mounted state is set before browser paint
  // This is a necessary pattern for theme toggles that need to wait for client-side hydration
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Return null during SSR to prevent hydration mismatch
  // The component will render on the client after useLayoutEffect runs
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-[#e8e6dc] p-1 dark:bg-[#141413]">
      <button
        onClick={() => setTheme("light")}
        className={`rounded-full p-2 transition-colors ${
          theme === "light"
            ? "bg-[#faf9f5] text-[#d97757] shadow-sm"
            : "text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5]"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`rounded-full p-2 transition-colors ${
          theme === "dark"
            ? "bg-[#141413] text-[#6a9bcc] shadow-sm"
            : "text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5]"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`rounded-full p-2 transition-colors ${
          theme === "system"
            ? "bg-[#faf9f5] text-[#788c5d] shadow-sm dark:bg-[#141413]"
            : "text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5]"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
