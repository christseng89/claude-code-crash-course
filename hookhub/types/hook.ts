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

export type Platform = "Windows" | "macOS" | "Linux" | "All";

export interface GitHubStats {
  stars: number;
  forks: number;
  issues: number;
  lastSync: string;
}

export interface HookMetadata {
  version: string;
  hookTypes: string[];
  matchers: string[];
  tags: string[];
  license: string;
  keywords: string[];
}

export interface HookStats {
  installs: number;
  dailyActive: number;
  rating: number;
  reviews: number;
  views: number;
}

export interface Compatibility {
  platforms: Platform[];
  dependencies: Dependency[];
}

export interface Dependency {
  name: string;
  version?: string;
  required: boolean;
  installCommand?: string;
}

export interface QualityMetrics {
  verified: boolean;
  communityChoice: boolean;
  securityAudited: boolean;
  documentationScore: number;
}

export interface Author {
  username: string;
  name?: string;
  avatarUrl: string;
  isVerified: boolean;
  reputation?: number;
}

export interface Hook {
  id: string;
  name: string;
  category: HookCategory;
  description: string;
  fullDescription?: string;
  repoUrl: string;
  repoOwner: string;
  repoName: string;
  github: GitHubStats;
  metadata: HookMetadata;
  stats: HookStats;
  compatibility: Compatibility;
  quality: QualityMetrics;
  author: Author;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type SortOption = "popular" | "recent" | "trending" | "mostUsed";
