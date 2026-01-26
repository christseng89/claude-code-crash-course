export enum HookCategory {
  PreToolUse = "PreToolUse",
  PostToolUse = "PostToolUse",
  SessionStart = "SessionStart",
  SessionEnd = "SessionEnd",
  UserPromptSubmit = "UserPromptSubmit",
  PermissionRequest = "PermissionRequest",
  SubagentStop = "SubagentStop",
  PreCompact = "PreCompact",
  Stop = "Stop",
  Notification = "Notification",
  Utility = "Utility",
  Workflow = "Workflow",
  Other = "Other"
}

export interface Hook {
  id: string;
  name: string;
  category: HookCategory;
  description: string;
  repoUrl: string;
  repoOwner: string;
  repoName: string;
  stars?: number;
  lastUpdated?: string;
}
