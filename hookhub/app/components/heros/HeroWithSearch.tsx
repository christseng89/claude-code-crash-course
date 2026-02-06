"use client";

import { useState, useEffect, useRef } from "react";
import { Webhook, Search, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

interface HeroWithSearchProps {
  // Search configuration
  onSearch?: (query: string) => void;

  // Optional customization
  title?: string;
  tagline?: string;
  showThemeToggle?: boolean;
  placeholder?: string;
}

export default function HeroWithSearch({
  onSearch,
  title = "HookHub",
  tagline = "Discover Claude Code hooks",
  showThemeToggle = true,
  placeholder = 'Search hooks... (Press "/" to focus)',
}: HeroWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery("");
    onSearch?.("");
    searchInputRef.current?.focus();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on "/" key
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Clear and blur on Escape
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        handleClear();
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Row 1: Logo, Title, and Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
              aria-label="HookHub Logo"
            >
              <Webhook className="h-6 w-6 text-white" aria-hidden="true" />
            </div>

            {/* Title */}
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-400 sm:text-3xl">
              {title}
            </h1>
          </div>

          {/* Theme Toggle */}
          {showThemeToggle && <ThemeToggle />}
        </div>

        {/* Row 2: Search Bar */}
        <div className="mt-4">
          <div className="relative w-full lg:max-w-2xl">
            {/* Search Icon */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>

            {/* Search Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={placeholder}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-gray-900 placeholder-gray-500 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
              aria-label="Search hooks"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Tagline - Below Search */}
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
            {tagline}
          </p>
        </div>
      </div>
    </header>
  );
}
