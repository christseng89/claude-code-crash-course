"use client";

import { Webhook, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "../ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface HeroWithNavProps {
  navItems?: NavItem[];
  title?: string;
  tagline?: string;
  showThemeToggle?: boolean;
}

const defaultNavItems: NavItem[] = [
  { label: "Browse", href: "/", active: true },
  { label: "Categories", href: "/categories", active: false },
  { label: "Popular", href: "/popular", active: false },
  { label: "New", href: "/new", active: false },
  { label: "Submit", href: "/submit", active: false },
];

export default function HeroWithNav({
  navItems = defaultNavItems,
  title = "HookHub",
  tagline = "Discover Claude Code hooks",
  showThemeToggle = true,
}: HeroWithNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            aria-label="HookHub Home"
          >
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2.5">
              <Webhook className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                {title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center"
            aria-label="Main navigation"
          >
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      item.active
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section: Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {showThemeToggle && <ThemeToggle />}

            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden rounded-lg p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      item.active
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
