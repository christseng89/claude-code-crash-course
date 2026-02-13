import HookGrid from "./components/HookGrid";
import Hero from "./components/heros/Hero";
import hooksData from "./data/hooks.json";
import { Hook } from "@/types/hook";

export default function Home() {
  const hooks = hooksData.hooks as Hook[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f5] via-[#e8e6dc] to-[#d97757]/10 dark:from-[#141413] dark:via-[#141413] dark:to-[#d97757]/5">
      <Hero />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <HookGrid hooks={hooks} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e6dc] bg-[#faf9f5]/50 backdrop-blur-sm dark:border-[#b0aea5]/50 dark:bg-[#141413]/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[#b0aea5]">
            Built for the Claude Code community
          </p>
        </div>
      </footer>
    </div>
  );
}
