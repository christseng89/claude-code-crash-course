"use client";

import { Webhook } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

interface HeroWithCTAProps {
  // CTA configuration
  ctaLabel?: string;
  ctaAction?: () => void;
  ctaHref?: string;

  // Optional customization
  title?: string;
  tagline?: string;
  showThemeToggle?: boolean;
}

export default function HeroWithCTA({
  ctaLabel = "Get Started",
  ctaAction,
  ctaHref,
  title = "HookHub",
  tagline = "Discover Claude Code hooks",
  showThemeToggle = true,
}: HeroWithCTAProps) {
  // Determine button element based on props
  const renderCTA = () => {
    const buttonClasses =
      "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";

    // Prefer href (Link) over action if both are provided
    if (ctaHref) {
      return (
        <Link href={ctaHref} className={buttonClasses} aria-label={ctaLabel}>
          {ctaLabel}
        </Link>
      );
    }

    if (ctaAction) {
      return (
        <button
          onClick={ctaAction}
          className={buttonClasses}
          aria-label={ctaLabel}
        >
          {ctaLabel}
        </button>
      );
    }

    // Default non-interactive CTA (should not happen in practice)
    return (
      <div className={buttonClasses} aria-label={ctaLabel}>
        {ctaLabel}
      </div>
    );
  };

  return (
    <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo Group */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2.5">
              <Webhook className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400">
                {title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tagline}
              </p>
            </div>
          </div>

          {/* CTA and Theme Toggle */}
          <div className="flex items-center gap-4">
            {renderCTA()}
            {showThemeToggle && <ThemeToggle />}
          </div>
        </div>
      </div>
    </header>
  );
}
