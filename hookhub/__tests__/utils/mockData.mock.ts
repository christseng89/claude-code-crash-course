import { Hook, HookCategory } from "@/types/hook";

export const mockHook: Hook = {
  id: "1",
  name: "format-typescript",
  category: HookCategory.PostToolUse,
  description: "Automatically formats TypeScript and TSX files using Prettier after Write or Edit operations",
  fullDescription: "This hook monitors file Write and Edit operations and automatically formats TypeScript (.ts) and TSX (.tsx) files using Prettier. It helps maintain consistent code formatting across your project without manual intervention.",
  repoUrl: "https://github.com/disler/format-typescript",
  repoOwner: "disler",
  repoName: "format-typescript",
  github: {
    stars: 487,
    forks: 52,
    issues: 8,
    lastSync: "2026-02-02T10:00:00Z"
  },
  metadata: {
    version: "1.2.0",
    hookTypes: ["PostToolUse"],
    matchers: ["Write", "Edit"],
    tags: ["formatting", "typescript", "prettier", "code-quality"],
    license: "MIT",
    keywords: ["format", "typescript", "tsx", "prettier", "automation"]
  },
  stats: {
    installs: 1247,
    dailyActive: 823,
    rating: 4.8,
    reviews: 156,
    views: 3421
  },
  compatibility: {
    platforms: ["All"],
    dependencies: [
      {
        name: "prettier",
        version: "^3.0.0",
        required: true,
        installCommand: "npm install -D prettier"
      }
    ]
  },
  quality: {
    verified: true,
    communityChoice: true,
    securityAudited: true,
    documentationScore: 95
  },
  author: {
    username: "disler",
    name: "David Disler",
    avatarUrl: "https://github.com/disler.png",
    isVerified: true,
    reputation: 2847
  },
  createdAt: "2025-12-15T10:00:00Z",
  updatedAt: "2026-02-01T15:30:00Z",
  publishedAt: "2025-12-16T09:00:00Z"
};

export const mockHook2: Hook = {
  id: "2",
  name: "activity-logger",
  category: HookCategory.PreToolUse,
  description: "Logs all tool usage to a daily file for auditing and tracking development activity",
  repoUrl: "https://github.com/ChrisWiles/activity-logger",
  repoOwner: "ChrisWiles",
  repoName: "activity-logger",
  github: {
    stars: 234,
    forks: 28,
    issues: 3,
    lastSync: "2026-02-02T09:30:00Z"
  },
  metadata: {
    version: "2.1.0",
    hookTypes: ["PreToolUse"],
    matchers: ["*"],
    tags: ["logging", "audit", "tracking"],
    license: "MIT",
    keywords: ["log", "audit", "tracking", "monitoring"]
  },
  stats: {
    installs: 892,
    dailyActive: 567,
    rating: 4.6,
    reviews: 98,
    views: 2134
  },
  compatibility: {
    platforms: ["All"],
    dependencies: [
      {
        name: "jq",
        required: false,
        installCommand: "brew install jq"
      }
    ]
  },
  quality: {
    verified: true,
    communityChoice: false,
    securityAudited: true,
    documentationScore: 87
  },
  author: {
    username: "ChrisWiles",
    name: "Chris Wiles",
    avatarUrl: "https://github.com/ChrisWiles.png",
    isVerified: true,
    reputation: 1523
  },
  createdAt: "2025-11-20T14:00:00Z",
  updatedAt: "2026-01-28T11:20:00Z",
  publishedAt: "2025-11-21T10:00:00Z"
};

export const mockHook3: Hook = {
  id: "3",
  name: "git-commit-lint",
  category: HookCategory.Workflow,
  description: "Validates commit messages against conventional commit standards",
  repoUrl: "https://github.com/example/git-commit-lint",
  repoOwner: "example",
  repoName: "git-commit-lint",
  github: {
    stars: 156,
    forks: 19,
    issues: 2,
    lastSync: "2026-02-02T08:00:00Z"
  },
  metadata: {
    version: "1.0.5",
    hookTypes: ["PreToolUse"],
    matchers: ["git commit"],
    tags: ["git", "linting", "commit"],
    license: "Apache-2.0",
    keywords: ["git", "commit", "lint", "conventional"]
  },
  stats: {
    installs: 445,
    dailyActive: 289,
    rating: 4.4,
    reviews: 67,
    views: 1245
  },
  compatibility: {
    platforms: ["All"],
    dependencies: []
  },
  quality: {
    verified: false,
    communityChoice: false,
    securityAudited: false,
    documentationScore: 72
  },
  author: {
    username: "example",
    name: "Example User",
    avatarUrl: "https://github.com/example.png",
    isVerified: false,
    reputation: 456
  },
  createdAt: "2026-01-05T09:00:00Z",
  updatedAt: "2026-01-30T14:00:00Z",
  publishedAt: "2026-01-06T10:00:00Z"
};

export const mockHooks: Hook[] = [mockHook, mockHook2, mockHook3];
