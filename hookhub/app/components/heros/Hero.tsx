import { Webhook } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export default function Hero() {
  return (
    <header className="border-b border-[#e8e6dc] bg-[#faf9f5]/80 backdrop-blur-lg dark:border-[#b0aea5]/50 dark:bg-[#141413]/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Anthropic brand colors: Orange #d97757 primary accent */}
            <div className="rounded-xl bg-[#d97757] p-2.5 shadow-sm">
              <Webhook className="h-6 w-6 text-[#faf9f5]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#141413] dark:text-[#faf9f5]">
                HookHub
              </h1>
              <p className="text-sm text-[#b0aea5] dark:text-[#b0aea5]">
                Discover Claude Code hooks
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
