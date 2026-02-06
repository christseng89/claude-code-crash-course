import HookGrid from "./components/HookGrid";
import HeroComparison from "./components/HeroComparison";
import hooksData from "./data/hooks.json";
import { Hook } from "@/types/hook";

export default function Home() {
  const hooks = hooksData.hooks as Hook[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Comparison Section */}
      <HeroComparison />

      {/* Main Content */}
      <main id="hooks" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Available Hooks
        </h2>
        <HookGrid hooks={hooks} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Built for the Claude Code community
          </p>
        </div>
      </footer>
    </div>
  );
}
