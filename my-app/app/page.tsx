"use client";

import { useState } from "react";
import { Cloud, Code, Zap, GitBranch, DownloadCloud, Upload, ChevronDown } from "lucide-react";

const hooks = [
  {
    name: "Auto Commit",
    description: "Generate intelligent commit messages automatically from your code changes",
    category: "Git Automation",
    icon: "🔀",
    downloads: 1204,
  },
  {
    name: "Security Review",
    description: "Scan your code for security vulnerabilities and best practices",
    category: "Security",
    icon: "🔒",
    downloads: 892,
  },
  {
    name: "Code Formatter",
    description: "Automatically format and lint code with Prettier and ESLint",
    category: "Formatting",
    icon: "✨",
    downloads: 2341,
  },
  {
    name: "Activity Logger",
    description: "Log all Claude Code tool usage and create audit trails",
    category: "Monitoring",
    icon: "📝",
    downloads: 654,
  },
  {
    name: "Pre-commit Validator",
    description: "Validate changes before committing to ensure code quality",
    category: "Testing",
    icon: "✅",
    downloads: 1102,
  },
  {
    name: "Notification Handler",
    description: "Get real-time notifications for Claude Code events",
    category: "Notifications",
    icon: "🔔",
    downloads: 743,
  },
];

const categories = [
  { name: "Git Automation", count: 12 },
  { name: "Security", count: 8 },
  { name: "Formatting", count: 15 },
  { name: "Testing", count: 9 },
  { name: "Monitoring", count: 6 },
  { name: "Notifications", count: 7 },
];

const faqs = [
  {
    question: "What are Claude Code hooks?",
    answer: "Claude Code hooks are automated scripts and integrations that trigger at specific points in your Claude Code workflow. They enable you to automate tasks like code formatting, commit messages, security scanning, and more without manual intervention.",
  },
  {
    question: "How do I install a hook?",
    answer: "Installing a hook is simple: browse the HooksHub registry, find the hook you want, and click the install button. The hook will be added to your ~/.claude/scripts/ directory, and you can configure it in your settings.json file.",
  },
  {
    question: "How do I publish my own hook?",
    answer: "Click the 'Publish Your Hook' button on our home page and follow our submission wizard. You'll need to provide documentation, test cases, and ensure your hook follows our community guidelines. Most hooks are published within 24 hours.",
  },
  {
    question: "Is HooksHub free to use?",
    answer: "Yes! HooksHub is completely free. All hooks in our registry are free to download and use. We believe in supporting the Claude Code community with no paywalls or restrictions.",
  },
  {
    question: "What hook events can I hook into?",
    answer: "Currently supported events include: PreToolUse, PostToolUse, SessionStart, SessionEnd, UserPromptSubmit, SubagentStop, and PreCompact. More event types are coming soon!",
  },
  {
    question: "How do I get support for hooks?",
    answer: "Each hook has a dedicated discussion board on HooksHub. You can also join our Discord community for real-time help, or check our documentation for detailed guides and troubleshooting tips.",
  },
  {
    question: "Can I modify hooks for my own use?",
    answer: "Yes! All hooks are provided with source code. You can modify them for personal use. If you create an improved version, we encourage you to publish it back to help the community!",
  },
  {
    question: "What happens if a hook breaks my workflow?",
    answer: "Hooks are designed to be safe, but if you experience issues, you can quickly disable a hook in your settings.json or remove it from your ~/.claude/scripts/ directory. Claude Code will continue working normally.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-600/50 rounded-lg overflow-hidden bg-slate-700/20 hover:bg-slate-700/30 transition">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/40 transition"
      >
        <span className="text-left font-semibold text-white">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-cyan-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-slate-600/50 bg-slate-800/30">
          <p className="text-slate-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated rain effect background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/20 via-transparent to-slate-900/40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                HooksHub
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#explore" className="text-slate-300 hover:text-cyan-400 transition">
                Browse
              </a>
              <a href="#publish" className="text-slate-300 hover:text-cyan-400 transition">
                Publish
              </a>
              <a href="#faq" className="text-slate-300 hover:text-cyan-400 transition">
                FAQ
              </a>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition">
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Automate Your{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                  Claude Code
                </span>{" "}
                Workflow
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Discover powerful hooks, scripts, and integrations to supercharge your productivity. Build, share, and collaborate with the Claude Code community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center justify-center gap-2">
                <DownloadCloud className="w-5 h-5" />
                Explore Hooks
              </button>
              <button className="px-8 py-3 rounded-lg border border-cyan-500/50 text-cyan-400 font-bold hover:bg-cyan-500/10 transition flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Publish Your Hook
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">200+</div>
                <div className="text-slate-400 text-sm">Hooks Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-400">15K+</div>
                <div className="text-slate-400 text-sm">Community Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">98%</div>
                <div className="text-slate-400 text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="group p-4 rounded-lg bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/50 hover:border-cyan-500/50 transition text-left"
              >
                <div className="font-semibold text-white group-hover:text-cyan-400 transition">
                  {cat.name}
                </div>
                <div className="text-sm text-slate-400">{cat.count} hooks</div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Hooks Section */}
        <section id="explore" className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Hooks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hooks.map((hook) => (
              <div
                key={hook.name}
                className="group p-6 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/50 hover:border-cyan-500/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-700/60 hover:to-slate-800/60 transition duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{hook.icon}</div>
                  <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {hook.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                  {hook.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {hook.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
                  <span className="text-xs text-slate-500">
                    ↓ {hook.downloads.toLocaleString()}
                  </span>
                  <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition">
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publish Section */}
        <section id="publish" className="max-w-7xl mx-auto px-6 py-16">
          <div className="rounded-2xl bg-gradient-to-r from-slate-700/50 via-slate-800/50 to-slate-700/50 border border-cyan-500/30 p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Share Your Hooks</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Have a useful hook or script? Share it with the Claude Code community and help thousands of developers automate their workflows.
            </p>
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Publish Your Hook
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about Claude Code hooks and HooksHub
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">
              Can't find what you're looking for?
            </p>
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
            >
              Check our documentation →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
              <p>© 2026 HooksHub. Made for China Systems community.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-cyan-400 transition">GitHub</a>
                <a href="#" className="hover:text-cyan-400 transition">Docs</a>
                <a href="#" className="hover:text-cyan-400 transition">Discord</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
