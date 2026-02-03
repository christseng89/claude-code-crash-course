import { Hook, HookCategory } from "@/types/hook";
import { Star, GitFork, ExternalLink } from "lucide-react";

interface HookCardProps {
  hook: Hook;
}

// Move colors to module level to prevent recreation on every render
// This eliminates ~286 object allocations per render (13 categories × 22 cards)
const CATEGORY_COLORS: Record<HookCategory, string> = {
  [HookCategory.PreToolUse]: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:ring-blue-500/30",
  [HookCategory.PostToolUse]: "bg-green-500/10 text-green-700 ring-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:ring-green-500/30",
  [HookCategory.SessionStart]: "bg-purple-500/10 text-purple-700 ring-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:ring-purple-500/30",
  [HookCategory.SessionEnd]: "bg-purple-500/10 text-purple-700 ring-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:ring-purple-500/30",
  [HookCategory.UserPromptSubmit]: "bg-indigo-500/10 text-indigo-700 ring-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 dark:ring-indigo-500/30",
  [HookCategory.PermissionRequest]: "bg-yellow-500/10 text-yellow-700 ring-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400 dark:ring-yellow-500/30",
  [HookCategory.SubagentStop]: "bg-pink-500/10 text-pink-700 ring-pink-500/20 dark:bg-pink-500/20 dark:text-pink-400 dark:ring-pink-500/30",
  [HookCategory.PreCompact]: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400 dark:ring-cyan-500/30",
  [HookCategory.Stop]: "bg-red-500/10 text-red-700 ring-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:ring-red-500/30",
  [HookCategory.Notification]: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/30",
  [HookCategory.Utility]: "bg-gray-500/10 text-gray-700 ring-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400 dark:ring-gray-500/30",
  [HookCategory.Workflow]: "bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 dark:ring-orange-500/30",
  [HookCategory.Other]: "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:ring-slate-500/30",
};

const getCategoryColor = (category: HookCategory): string => {
  return CATEGORY_COLORS[category];
};

export default function HookCard({ hook }: HookCardProps) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 dark:border-gray-800/50 dark:bg-gray-900/80">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${getCategoryColor(
            hook.category
          )}`}
        >
          {hook.category}
        </span>
        {hook.github && (
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {hook.github.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" />
              {hook.github.forks}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {hook.name}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 line-clamp-3 dark:text-gray-400">
          {hook.description}
        </p>
      </div>

      {hook.metadata?.tags && hook.metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hook.metadata.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4">
        <a
          href={hook.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View on GitHub
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
