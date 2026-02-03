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
    <div className="flex items-center gap-1 rounded-full bg-gray-200 p-1 dark:bg-gray-800">
      <button
        onClick={() => setTheme("light")}
        className={`rounded-full p-2 transition-colors ${
          theme === "light"
            ? "bg-white text-amber-500 shadow-sm dark:bg-gray-700"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`rounded-full p-2 transition-colors ${
          theme === "dark"
            ? "bg-gray-700 text-blue-400 shadow-sm"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`rounded-full p-2 transition-colors ${
          theme === "system"
            ? "bg-white text-purple-500 shadow-sm dark:bg-gray-700"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
