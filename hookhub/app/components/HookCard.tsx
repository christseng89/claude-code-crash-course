import { Hook, HookCategory } from "@/types/hook";

interface HookCardProps {
  hook: Hook;
}

const getCategoryColor = (category: HookCategory): string => {
  const colors: Record<HookCategory, string> = {
    [HookCategory.PreToolUse]: "bg-blue-100 text-blue-800",
    [HookCategory.PostToolUse]: "bg-green-100 text-green-800",
    [HookCategory.SessionStart]: "bg-purple-100 text-purple-800",
    [HookCategory.SessionEnd]: "bg-purple-100 text-purple-800",
    [HookCategory.UserPromptSubmit]: "bg-indigo-100 text-indigo-800",
    [HookCategory.PermissionRequest]: "bg-yellow-100 text-yellow-800",
    [HookCategory.SubagentStop]: "bg-pink-100 text-pink-800",
    [HookCategory.PreCompact]: "bg-cyan-100 text-cyan-800",
    [HookCategory.Stop]: "bg-red-100 text-red-800",
    [HookCategory.Notification]: "bg-amber-100 text-amber-800",
    [HookCategory.Utility]: "bg-gray-100 text-gray-800",
    [HookCategory.Workflow]: "bg-orange-100 text-orange-800",
    [HookCategory.Other]: "bg-slate-100 text-slate-800",
  };
  return colors[category];
};

export default function HookCard({ hook }: HookCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
            hook.category
          )}`}
        >
          {hook.category}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{hook.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{hook.description}</p>
      </div>

      <div className="mt-auto pt-2">
        <a
          href={hook.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
