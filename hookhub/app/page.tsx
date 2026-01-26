import HookGrid from "./components/HookGrid";
import hooksData from "./data/hooks.json";
import { Hook } from "@/types/hook";

export default function Home() {
  const hooks = hooksData.hooks as Hook[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              HookHub
            </h1>
            <p className="text-lg text-gray-600">
              Discover and browse open-source Claude Code hooks from the community
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HookGrid hooks={hooks} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            Built with ❤️ for the Claude Code community
          </p>
        </div>
      </footer>
    </div>
  );
}
