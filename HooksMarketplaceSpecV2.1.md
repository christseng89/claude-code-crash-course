# Cloud Code Hooks Marketplace Specification v2.1

**Document Version:** 2.1  
**Last Updated:** February 02, 2026  
**Status:** Ready for Implementation  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Hook Types & Categories](#2-hook-types--categories)
3. [Homepage Design](#3-homepage-design)
4. [Hook Card Design](#4-hook-card-design)
5. [Technical Architecture](#5-technical-architecture)
6. [Core Features](#6-core-features)
7. [Data Model](#7-data-model)
8. [Hook Chains & Composition](#8-hook-chains--composition)
9. [Submission & Quality Control](#9-submission--quality-control)
10. [Error Handling & Edge Cases](#10-error-handling--edge-cases)
11. [Security & Trust](#11-security--trust)
12. [Hook Creator's Guide](#12-hook-creators-guide)
13. [MVP Implementation Plan](#13-mvp-implementation-plan)
14. [Success Metrics](#14-success-metrics)

---

## 1. Overview

### 1.1 Purpose
**HookHub** is a curated marketplace for discovering, evaluating, and installing Cloud Code hooks. It helps developers automate their workflows by providing a centralized repository of community-created hooks with clear documentation and easy installation.

### 1.2 Core Value Propositions
- **Discover**: Browse hundreds of hooks by category, type, and use case
- **Evaluate**: Compare hooks with ratings, install counts, and community feedback
- **Install**: One-click copy-paste configuration snippets
- **Compose**: Combine multiple hooks into powerful workflows
- **Trust**: Verified, security-audited hooks from trusted authors

### 1.3 Target Audience
- **Primary**: Claude Code users seeking workflow automation
- **Secondary**: Hook creators wanting to share their tools
- **Tertiary**: Teams standardizing development practices

---

## 2. Hook Types & Categories

### 2.1 Hook Types (Lifecycle Events)

```typescript
type HookType =
  // Pre/Post Tool Execution
  | "PreToolUse"        // Before any tool runs (Bash, Write, Edit, Read)
  | "PostToolUse"       // After any tool completes
  
  // Code Generation
  | "PreGeneration"     // Before Claude generates code (NEW - renamed from BeforeGeneration)
  | "PostGeneration"    // After Claude generates code (NEW - renamed from AfterGeneration)
  
  // Session Lifecycle
  | "SessionStart"      // When Claude Code session begins
  | "SessionEnd"        // When session completes
  | "Stop"              // When user stops Claude
  | "SubagentStop"      // When subagent finishes
  
  // User Interaction
  | "UserPromptSubmit"  // When user sends a message
  
  // Version Control
  | "PreCommit"         // Before git commit (NEW - renamed from BeforeCommit)
  | "PostCommit"        // After git commit (NEW - renamed from AfterCommit)
  
  // Error & Events
  | "OnError"           // When tools fail or errors occur
  | "OnFileChange"      // When files are modified
  | "Notification"      // System notifications
  
  // Advanced
  | "PreCompact"        // Before context window compaction
  | "CustomWebhook";    // External service integrations
```

### 2.2 Hook Categories

```typescript
enum HookCategory {
  SECURITY = "🛡️ Security & Validation",
  FORMATTING = "🎨 Code Formatting & Linting",
  ANALYTICS = "📊 Analytics & Monitoring",
  GIT = "🔄 Git & Version Control",
  TESTING = "🧪 Testing & QA",
  DOCS = "📝 Documentation Generation",
  CICD = "🚀 Deployment & CI/CD",
  DEVTOOLS = "🔧 Development Tools",
  BACKUP = "💾 Backup & Recovery",
  INTEGRATIONS = "🌐 API Integrations",
  PRODUCTIVITY = "⚡ Productivity",
  COLLABORATION = "👥 Team Collaboration"
}
```

### 2.3 Popular Hook Examples

| Hook Name | Type | Category | Description |
|-----------|------|----------|-------------|
| bash-validator | PreToolUse | Security | Blocks dangerous bash commands |
| format-typescript | PostToolUse | Formatting | Auto-format with Prettier |
| git-auto-commit | PostGeneration | Git | Create atomic commits |
| test-runner | PostToolUse | Testing | Run tests on code changes |
| secret-scanner | PreCommit | Security | Detect hardcoded secrets |
| error-logger | OnError | Analytics | Log errors to monitoring service |
| ai-commit-msg | PreCommit | Git | Generate semantic commit messages |
| screenshot-notif | Notification | Productivity | Visual + audio alerts |

---

## 3. Homepage Design

### 3.1 Layout Structure

```
┌───────────────────────────────────────────────────────────┐
│                    HEADER & NAVIGATION                    │
│  [HookHub Logo]  [Explore] [Submit] [Docs] [Sign In]     │
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│                   HERO SEARCH SECTION                     │
│  🔍 Search 500+ Claude Code hooks...                      │
│                                                           │
│  Quick Filters:                                           │
│  [All] [PreToolUse] [PostToolUse] [Security] [Git]       │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  ⭐ FEATURED HOOKS (3-6 large cards)                      │
├───────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Featured │  │ Featured │  │ Featured │               │
│  │  Hook 1  │  │  Hook 2  │  │  Hook 3  │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  🔥 MOST POPULAR THIS WEEK                [View All →]    │
├───────────────────────────────────────────────────────────┤
│  [Card] [Card] [Card] [Card] [Card]                       │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  ✨ RECENTLY ADDED                        [View All →]    │
├───────────────────────────────────────────────────────────┤
│  [Card] [Card] [Card] [Card] [Card]                       │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  🛡️ SECURITY HOOKS                        [View All →]    │
├───────────────────────────────────────────────────────────┤
│  [Card] [Card] [Card] [Card]                              │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  🎨 FORMATTING HOOKS                      [View All →]    │
├───────────────────────────────────────────────────────────┤
│  [Card] [Card] [Card] [Card]                              │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  🔗 POPULAR HOOK WORKFLOWS                                │
├───────────────────────────────────────────────────────────┤
│  [Chain Card] [Chain Card] [Chain Card]                   │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  📚 ALL HOOKS (Filtered Results)                          │
├───────────────────────────────────────────────────────────┤
│  [Card] [Card] [Card] [Card] [Card]                       │
│  [Card] [Card] [Card] [Card] [Card]                       │
│  [Card] [Card] [Card] [Card] [Card]                       │
│                                                           │
│  ← Infinite scroll, lazy load 30 cards at a time →       │
└───────────────────────────────────────────────────────────┘
```

### 3.2 Responsive Grid

- **Desktop (>1280px)**: 5 cards per row
- **Laptop (1024-1279px)**: 4 cards per row
- **Tablet (768-1023px)**: 3 cards per row
- **Mobile (640-767px)**: 2 cards per row
- **Small Mobile (<640px)**: 1 card per row

### 3.3 Scroll Behavior

- **Initial Load**: 30 hooks (6 rows × 5 cards)
- **Lazy Load**: When user scrolls to bottom, load next 30
- **Performance**: Virtualize rows if >100 hooks visible
- **Skeleton States**: Show loading placeholders during fetch

---

## 4. Hook Card Design

### 4.1 Compact View (Default State)

```
┌────────────────────────────────────────┐
│ [PreToolUse] 🛡️              ⭐ Star  │  ← Hover shows "Add to favorites"
│                                        │
│ bash-validator                         │  ← Hook name (bold, 18px)
│ by @username           ⭐ 234          │  ← Author + GitHub stars
│ ────────────────────────────────────   │
│ Validates bash commands before         │  ← 2-line description
│ execution to prevent dangerous ops     │
│                                        │
│ [security] [validation]                │  ← Category tags
│                                        │
│ [📋 Copy Install]  [👁️ View Details]   │  ← Primary CTAs
└────────────────────────────────────────┘
```

### 4.2 Expanded View (On Hover)

```
┌────────────────────────────────────────┐
│ [PreToolUse] 🛡️              ⭐ Star  │
│ ✓ Verified Author                      │  ← Trust badge
│                                        │
│ bash-validator                         │
│ by @username           ⭐ 234          │
│ 📥 1.2k installs  📊 98% uptime        │  ← Usage stats
│ ────────────────────────────────────   │
│ Validates bash commands before         │
│ execution to prevent dangerous         │
│ operations like rm -rf /               │  ← Expanded description
│                                        │
│ ✓ Blocks rm -rf /                      │  ← Feature bullets
│ ✓ Validates file permissions           │
│ ✓ Custom rule engine                   │
│                                        │
│ [security] [validation] [bash]         │
│                                        │
│ Dependencies: jq, bash >= 4.0          │  ← Requirements
│ Setup: ~2 mins                         │
│                                        │
│ [📋 Copy Install]  [👁️ View Details]   │
└────────────────────────────────────────┘
```

### 4.3 Copy Install Button Behavior

When user clicks **"📋 Copy Install"**:

```javascript
// Copied to clipboard:
{
  "hooks": [{
    "type": "PreToolUse",
    "matcher": "Bash",
    "path": "~/.claude/hooks/bash-validator.sh"
  }]
}

// Toast notification appears:
┌────────────────────────────────────────┐
│ ✓ Configuration copied to clipboard!  │
│   Paste into ~/.claude/config.json    │
│   [View Installation Guide →]         │
└────────────────────────────────────────┘
```

### 4.4 Card States

```typescript
type CardState = {
  default: {
    border: "gray-200",
    shadow: "sm",
    scale: 1
  };
  hover: {
    border: "blue-500",
    shadow: "lg",
    scale: 1.02,
    showExpandedInfo: true
  };
  active: {
    border: "blue-600",
    shadow: "xl"
  };
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  };
};
```

### 4.5 Quality Indicators (Badges)

```
[✓ Verified]     - Author identity confirmed
[🏆 Top Rated]   - >4.5 stars with 50+ reviews
[🔒 Audited]     - Security audit passed
[⚡ Fast]        - <100ms overhead
[📚 Documented]  - Comprehensive README
[🆕 New]         - Added in last 7 days
```

---

## 5. Technical Architecture

### 5.1 MVP Tech Stack (Phase 1 - Simplified)

```typescript
const mvpStack = {
  frontend: {
    framework: "Next.js 14 (App Router)",
    language: "TypeScript 5",
    styling: "Tailwind CSS 4 + Radix UI",
    state: "Zustand (filters/search)",
    rendering: "SSG + ISR (revalidate: 3600)"
  },
  
  data: {
    storage: "Static JSON file (curated)",
    search: "Fuse.js (client-side fuzzy search)",
    cache: "Next.js built-in caching"
  },
  
  integrations: {
    github: "GitHub REST API (cached)",
    analytics: "Vercel Analytics",
    monitoring: "Vercel Speed Insights"
  },
  
  deployment: {
    hosting: "Vercel",
    domain: "hookhub.dev",
    cdn: "Vercel Edge Network"
  }
};
```

**Why This Stack?**
- ✅ Zero infrastructure costs for MVP
- ✅ Sub-100ms response times via edge
- ✅ No database setup/maintenance
- ✅ Easy to iterate and deploy
- ✅ Scales to 100k+ monthly users

### 5.2 Phase 2 Tech Stack (Dynamic Features)

```typescript
const phase2Stack = {
  database: "Supabase (PostgreSQL + Auth)",
  cache: "Vercel KV (Redis)",
  search: "Typesense (open source)",
  queue: "Vercel Cron Jobs",
  storage: "Supabase Storage"
};
```

### 5.3 Phase 3 Tech Stack (Full Platform)

```typescript
const phase3Stack = {
  search: "Algolia",
  realtime: "Supabase Realtime",
  cdn: "Cloudflare R2",
  monitoring: "Sentry + PostHog"
};
```

### 5.4 File Structure

```
hookhub/
├── app/
│   ├── layout.tsx                 # Root layout with header/footer
│   ├── page.tsx                   # Homepage with sections
│   ├── explore/
│   │   └── page.tsx               # Full grid with advanced filters
│   ├── hooks/
│   │   └── [id]/
│   │       ├── page.tsx           # Hook detail page
│   │       └── opengraph-image.tsx # OG image generation
│   ├── chains/
│   │   ├── page.tsx               # Hook workflows library
│   │   └── [id]/page.tsx          # Chain detail
│   ├── submit/
│   │   └── page.tsx               # Hook submission form
│   ├── api/
│   │   ├── github/
│   │   │   └── route.ts           # Fetch GitHub data
│   │   ├── search/
│   │   │   └── route.ts           # Search endpoint (Phase 2)
│   │   └── webhooks/
│   │       └── github/route.ts    # GitHub webhook handler
│   └── components/
│       ├── HookCard.tsx           # Main hook card
│       ├── HookCardExpanded.tsx   # Hover state
│       ├── HookGrid.tsx           # Grid container
│       ├── SearchBar.tsx          # Search with suggestions
│       ├── FilterPanel.tsx        # Advanced filters
│       ├── QuickFilters.tsx       # Pill button filters
│       ├── CategorySection.tsx    # "Security Hooks" section
│       ├── FeaturedHooks.tsx      # Hero featured cards
│       ├── HookChainCard.tsx      # Workflow card
│       ├── CopyInstallButton.tsx  # Copy config snippet
│       ├── QualityBadges.tsx      # Verification badges
│       └── InstallModal.tsx       # Detailed install guide
│
├── data/
│   ├── hooks.json                 # Curated hooks (source of truth)
│   ├── chains.json                # Popular hook workflows
│   ├── categories.json            # Category metadata
│   └── featured.json              # Featured hook IDs
│
├── lib/
│   ├── hooks/
│   │   ├── getHooks.ts            # Data fetching
│   │   ├── filterHooks.ts         # Client-side filtering
│   │   ├── searchHooks.ts         # Fuzzy search
│   │   └── sortHooks.ts           # Sorting logic
│   ├── github/
│   │   ├── fetchStars.ts          # Get repo stars
│   │   ├── fetchReadme.ts         # Get README content
│   │   └── cache.ts               # Caching layer
│   ├── validation/
│   │   └── hookSchema.ts          # Zod schemas
│   └── utils/
│       ├── clipboard.ts           # Copy to clipboard
│       └── analytics.ts           # Track events
│
├── types/
│   ├── hook.ts                    # Hook interfaces
│   ├── chain.ts                   # Chain interfaces
│   └── api.ts                     # API response types
│
├── styles/
│   └── globals.css                # Tailwind + custom styles
│
├── public/
│   ├── avatars/                   # Cached author avatars
│   ├── og-images/                 # Social share images
│   └── icons/                     # Hook type icons
│
├── scripts/
│   ├── sync-github-data.ts        # Update stars/stats
│   ├── validate-hooks.ts          # Validate JSON schema
│   └── generate-sitemap.ts        # SEO sitemap
│
└── tests/
    ├── hooks.test.ts
    ├── search.test.ts
    └── components/
        └── HookCard.test.tsx
```

---

## 6. Core Features

### 6.1 Discovery & Search

#### 6.1.1 Smart Search

```typescript
interface SearchFeatures {
  // Core functionality
  query: string;                    // User search term
  fuzzyMatch: boolean;              // Typo tolerance (default: true)
  
  // Search across fields
  searchFields: [
    "name",
    "description", 
    "tags",
    "category",
    "author.username"
  ];
  
  // Results enhancement
  highlightMatches: boolean;        // Highlight matched terms
  suggestions: string[];            // "Did you mean..."
  relatedSearches: string[];        // Common follow-up searches
  
  // Performance
  debounceMs: 300;                  // Wait before searching
  maxResults: 100;                  // Limit results
}
```

**Search UI Features:**
```
┌─────────────────────────────────────────────────┐
│ 🔍 Search hooks...                          [×] │
└─────────────────────────────────────────────────┘
  💡 Try: "git commit", "format typescript"
  
  📊 Trending: security, testing, prettier
  🕒 Recent: "bash validator", "auto commit"
```

#### 6.1.2 Multi-Filter System

```typescript
interface FilterState {
  hookTypes: HookType[];            // Multiple selection
  categories: Category[];           // Multiple selection
  platforms: Platform[];            // macOS, Linux, Windows
  difficulty: Difficulty[];         // Beginner, Intermediate, Advanced
  verified: boolean;                // Only verified authors
  
  // Advanced filters
  minStars: number;                 // Minimum GitHub stars
  maxSetupTime: number;             // Max setup time (minutes)
  hasDocumentation: boolean;        // Must have README
  
  // Sort
  sortBy: "popular" | "recent" | "alphabetical" | "trending";
  sortOrder: "asc" | "desc";
}
```

**Filter UI:**
```
┌─────────────────────────────────────────────────┐
│ Quick Filters (Pill Buttons)                    │
├─────────────────────────────────────────────────┤
│ [All] [⚡ Popular] [🆕 New] [⭐ Featured]       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🔧 Advanced Filters                             │
├─────────────────────────────────────────────────┤
│ Hook Type:                                      │
│ ☑ PreToolUse  ☑ PostToolUse  ☐ SessionStart   │
│                                                 │
│ Category:                                       │
│ ☑ Security  ☑ Git  ☐ Testing  ☐ Formatting     │
│                                                 │
│ Platform:                                       │
│ ☑ macOS  ☑ Linux  ☐ Windows                    │
│                                                 │
│ Difficulty:                                     │
│ ☑ Beginner  ☐ Intermediate  ☐ Advanced         │
│                                                 │
│ ☐ Verified authors only                        │
│ ☐ Has video tutorial                           │
│                                                 │
│ [Clear All] [Apply Filters]                    │
└─────────────────────────────────────────────────┘
```

### 6.2 Hook Detail Page

```typescript
interface HookDetailPage {
  sections: [
    "Hero",              // Name, author, stats, install button
    "Overview",          // Description, use cases
    "QuickStart",        // Installation steps
    "Configuration",     // Config examples with copy buttons
    "Features",          // Bullet points of what it does
    "Requirements",      // Dependencies, system requirements
    "Examples",          // Code snippets, use cases
    "Compatibility",     // Claude Code versions, platforms
    "Performance",       // Overhead metrics, benchmarks
    "Security",          // Audit results, permissions needed
    "Changelog",         // Version history
    "Community",         // Reviews, Q&A, issues
    "RelatedHooks",      // Suggestions
    "SimilarWorkflows"   // Hook chains featuring this hook
  ];
}
```

**Hero Section:**
```
┌─────────────────────────────────────────────────────┐
│ [PreToolUse] 🛡️                                     │
│                                                     │
│ bash-validator                                      │
│ Validates bash commands before execution            │
│                                                     │
│ by @johndoe  ⭐ 234  📥 1.2k  💬 45  ✓ Verified    │
│                                                     │
│ [📋 Copy Install]  [⭐ Star (234)]  [🔗 GitHub]    │
│                                                     │
│ [security] [validation] [bash] [productivity]       │
└─────────────────────────────────────────────────────┘
```

### 6.3 Installation Experience

```typescript
interface InstallationFlow {
  steps: [
    {
      title: "1. Copy Configuration",
      action: "Click 'Copy Install' button",
      clipboard: {
        "hooks": [{
          "type": "PreToolUse",
          "matcher": "Bash",
          "path": "~/.claude/hooks/bash-validator.sh"
        }]
      }
    },
    {
      title: "2. Add to Config",
      action: "Open ~/.claude/config.json",
      visual: "Show editor with highlighted line to add"
    },
    {
      title: "3. Download Hook Script",
      action: "curl https://hookhub.dev/hooks/bash-validator/download.sh | bash",
      alternativeAction: "Manual download from GitHub"
    },
    {
      title: "4. Verify Installation",
      action: "Run: claude-code --hooks list",
      expectedOutput: "✓ bash-validator (PreToolUse)"
    }
  ];
  
  // Alternative: One-Click Install (Phase 3)
  cliInstall: "npx hookhub install bash-validator";
}
```

### 6.4 User Interactions

```typescript
interface UserActions {
  // Card actions
  copyInstall: () => void;          // Copy config to clipboard
  viewDetails: () => void;          // Navigate to detail page
  starHook: () => void;             // Add to favorites (localStorage)
  shareHook: () => void;            // Copy share link
  
  // Detail page actions
  installHook: () => void;          // Show install modal
  reportIssue: () => void;          // Open GitHub issue
  rateHook: (rating: 1-5) => void;  // Submit rating (Phase 2)
  writeReview: () => void;          // Add review (Phase 2)
  forkHook: () => void;             // GitHub fork
  
  // Discovery actions
  viewSimilar: (hookId) => void;    // Find related hooks
  viewByAuthor: (username) => void; // All hooks by author
  viewByCategory: (category) => void; // Category page
}
```

---

## 7. Data Model

### 7.1 Core Hook Entity

```typescript
interface Hook {
  // Identity
  id: string;                       // Unique slug: "bash-validator"
  name: string;                     // Display name: "Bash Validator"
  description: string;              // Short (2-3 sentences)
  longDescription?: string;         // Detailed explanation
  
  // GitHub Integration
  github: {
    url: string;                    // Full repo URL
    owner: string;                  // Username/org
    repo: string;                   // Repository name
    stars: number;                  // Star count (cached)
    forks: number;
    issues: number;
    lastCommit: string;             // ISO date
    branch: string;                 // Usually "main"
    path: string;                   // Path to hook file in repo
  };
  
  // Classification
  metadata: {
    version: string;                // Semantic version: "1.2.3"
    hookTypes: HookType[];          // Can match multiple types
    matchers: string[];             // Tool matchers: ["Bash", "Write"]
    category: Category;             // Primary category
    tags: string[];                 // Additional searchable tags
    difficulty: "beginner" | "intermediate" | "advanced";
  };
  
  // Quick Start (CRITICAL for UX)
  quickStart: {
    installCommand: string;         // One-liner to install
    configSnippet: string;          // JSON config to copy
    setupTime: number;              // Estimated minutes
    oneLineDescription: string;     // "Validates bash before execution"
  };
  
  // Installation & Usage
  installation: {
    method: "script" | "manual" | "npm" | "brew";
    instructions: {
      step: number;
      title: string;
      command?: string;
      description: string;
    }[];
    verificationCommand: string;    // Command to check if installed
  };
  
  // Dependencies & Requirements
  dependencies: {
    required: {
      name: string;
      version: string;
      installInstructions: {
        macos: string;
        linux: string;
        windows: string;
      };
    }[];
    optional: string[];
  };
  
  // Compatibility
  compatibility: {
    minVersion: string;             // Min Claude Code version: ">=0.3.0"
    maxVersion?: string;            // If incompatible with newer versions
    platforms: ("macos" | "linux" | "windows")[];
    tested: {
      os: string;
      version: string;
      date: string;
      tester: string;
    }[];
  };
  
  // Performance & Quality
  performance: {
    overhead: number;               // Milliseconds
    async: boolean;                 // Runs asynchronously
    blocking: boolean;              // Blocks tool execution
    resourceUsage: "low" | "medium" | "high";
  };
  
  // Configuration
  config: {
    examples: {
      title: string;
      description: string;
      snippet: string;              // JSON or YAML
      useCase: string;
    }[];
    schema?: JSONSchema;            // For validation
    defaults: Record<string, any>;  // Default config values
  };
  
  // Community & Stats
  stats: {
    installs: number;               // Via CLI or copy button clicks
    views: number;
    favorites: number;
    rating: number;                 // 0-5, average
    reviewCount: number;
  };
  
  // Author
  author: {
    name: string;
    username: string;               // GitHub username
    avatar: string;                 // Avatar URL
    url: string;                    // GitHub profile
    verified: boolean;              // ✓ Verified badge
    totalHooks: number;             // Hooks by this author
    reputation: number;             // Community score
  };
  
  // Media & Documentation
  media: {
    screenshots: string[];          // URLs to images
    videoUrl?: string;              // Demo video
    demoGif?: string;               // Animated demo
    readmeUrl: string;              // Link to README
  };
  
  // Quality Indicators
  quality: {
    verified: boolean;              // ✓ Verified
    featured: boolean;              // Featured on homepage
    topRated: boolean;              // >4.5 stars, 50+ reviews
    securityAudited: boolean;       // 🔒 Security audit passed
    wellDocumented: boolean;        // 📚 Comprehensive docs
    fastPerformance: boolean;       // ⚡ <100ms overhead
  };
  
  // Lifecycle
  lifecycle: {
    createdAt: string;              // ISO date
    updatedAt: string;              // ISO date
    lastVerified: string;           // Last tested date
    deprecated: boolean;
    deprecationReason?: string;
    replacedBy?: string;            // Hook ID of replacement
    status: "active" | "deprecated" | "archived";
  };
  
  // SEO
  seo: {
    slug: string;                   // URL-friendly: bash-validator
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;                // Open Graph image URL
  };
}
```

### 7.2 Example Hook Entry

```json
{
  "id": "bash-validator",
  "name": "Bash Validator",
  "description": "Validates bash commands before execution to prevent dangerous operations like rm -rf /",
  "longDescription": "This hook provides a safety layer for bash commands executed by Claude Code. It analyzes commands for dangerous patterns, validates file permissions, and can block potentially destructive operations. Includes a customizable rule engine for team-specific policies.",
  
  "github": {
    "url": "https://github.com/awesome-dev/bash-validator-hook",
    "owner": "awesome-dev",
    "repo": "bash-validator-hook",
    "stars": 234,
    "forks": 18,
    "issues": 3,
    "lastCommit": "2026-01-28T10:30:00Z",
    "branch": "main",
    "path": "src/bash-validator.sh"
  },
  
  "metadata": {
    "version": "1.2.3",
    "hookTypes": ["PreToolUse"],
    "matchers": ["Bash"],
    "category": "Security",
    "tags": ["security", "validation", "bash", "safety", "prevention"],
    "difficulty": "beginner"
  },
  
  "quickStart": {
    "installCommand": "curl -fsSL https://hookhub.dev/install/bash-validator | bash",
    "configSnippet": "{\n  \"hooks\": [{\n    \"type\": \"PreToolUse\",\n    \"matcher\": \"Bash\",\n    \"path\": \"~/.claude/hooks/bash-validator.sh\"\n  }]\n}",
    "setupTime": 2,
    "oneLineDescription": "Blocks dangerous bash commands before execution"
  },
  
  "installation": {
    "method": "script",
    "instructions": [
      {
        "step": 1,
        "title": "Download the hook script",
        "command": "curl -o ~/.claude/hooks/bash-validator.sh https://raw.githubusercontent.com/awesome-dev/bash-validator-hook/main/src/bash-validator.sh",
        "description": "Downloads the validation script to your hooks directory"
      },
      {
        "step": 2,
        "title": "Make it executable",
        "command": "chmod +x ~/.claude/hooks/bash-validator.sh",
        "description": "Grants execution permissions to the script"
      },
      {
        "step": 3,
        "title": "Add to config",
        "description": "Copy the config snippet to ~/.claude/config.json"
      }
    ],
    "verificationCommand": "~/.claude/hooks/bash-validator.sh --version"
  },
  
  "dependencies": {
    "required": [
      {
        "name": "jq",
        "version": ">=1.6",
        "installInstructions": {
          "macos": "brew install jq",
          "linux": "apt install jq",
          "windows": "choco install jq"
        }
      }
    ],
    "optional": ["shellcheck"]
  },
  
  "compatibility": {
    "minVersion": "0.3.0",
    "platforms": ["macos", "linux"],
    "tested": [
      {
        "os": "macOS 14",
        "version": "0.4.2",
        "date": "2026-01-28",
        "tester": "@awesome-dev"
      }
    ]
  },
  
  "performance": {
    "overhead": 45,
    "async": false,
    "blocking": true,
    "resourceUsage": "low"
  },
  
  "config": {
    "examples": [
      {
        "title": "Basic Setup",
        "description": "Default configuration for common use cases",
        "snippet": "{\n  \"hooks\": [{\n    \"type\": \"PreToolUse\",\n    \"matcher\": \"Bash\",\n    \"path\": \"~/.claude/hooks/bash-validator.sh\"\n  }]\n}",
        "useCase": "Prevent accidental destructive commands"
      },
      {
        "title": "Strict Mode",
        "description": "Block all commands with sudo",
        "snippet": "{\n  \"hooks\": [{\n    \"type\": \"PreToolUse\",\n    \"matcher\": \"Bash\",\n    \"path\": \"~/.claude/hooks/bash-validator.sh\",\n    \"config\": { \"allowSudo\": false }\n  }]\n}",
        "useCase": "Maximum safety for production environments"
      }
    ],
    "defaults": {
      "allowSudo": true,
      "dangerousPatterns": ["rm -rf /", "dd if=", "mkfs"],
      "logLevel": "warn"
    }
  },
  
  "stats": {
    "installs": 1247,
    "views": 8934,
    "favorites": 156,
    "rating": 4.7,
    "reviewCount": 23
  },
  
  "author": {
    "name": "John Doe",
    "username": "awesome-dev",
    "avatar": "https://avatars.githubusercontent.com/u/12345",
    "url": "https://github.com/awesome-dev",
    "verified": true,
    "totalHooks": 8,
    "reputation": 92
  },
  
  "media": {
    "screenshots": [
      "https://hookhub.dev/media/bash-validator-1.png"
    ],
    "videoUrl": "https://youtube.com/watch?v=...",
    "demoGif": "https://hookhub.dev/media/bash-validator-demo.gif",
    "readmeUrl": "https://github.com/awesome-dev/bash-validator-hook#readme"
  },
  
  "quality": {
    "verified": true,
    "featured": true,
    "topRated": true,
    "securityAudited": true,
    "wellDocumented": true,
    "fastPerformance": true
  },
  
  "lifecycle": {
    "createdAt": "2025-11-15T08:00:00Z",
    "updatedAt": "2026-01-28T10:30:00Z",
    "lastVerified": "2026-01-28T10:30:00Z",
    "deprecated": false,
    "status": "active"
  },
  
  "seo": {
    "slug": "bash-validator",
    "metaTitle": "Bash Validator - Prevent Dangerous Commands in Claude Code",
    "metaDescription": "Security hook that validates bash commands before execution. Blocks rm -rf /, validates permissions, and prevents destructive operations.",
    "keywords": ["bash", "security", "validation", "claude code", "hook"],
    "ogImage": "https://hookhub.dev/og/bash-validator.png"
  }
}
```

---

## 8. Hook Chains & Composition

### 8.1 Concept

**Hook Chains** are pre-configured workflows that combine multiple hooks into a single, cohesive automation pipeline. They represent common developer workflows and best practices.

### 8.2 Chain Data Model

```typescript
interface HookChain {
  // Identity
  id: string;                       // "code-quality-pipeline"
  name: string;                     // "Code Quality Pipeline"
  description: string;              // What the chain does
  icon: string;                     // Emoji or icon
  
  // Hooks in the chain
  hooks: {
    hookId: string;                 // Reference to Hook.id
    order: number;                  // Execution order
    config: Record<string, any>;    // Hook-specific config
    optional: boolean;              // Can be skipped
  }[];
  
  // Metadata
  category: Category;
  tags: string[];
  useCase: string;                  // Detailed explanation
  
  // Stats
  popularity: number;               // Install count
  rating: number;
  
  // Installation
  installCommand: string;           // One-click install all hooks
  
  // Examples
  examples: {
    title: string;
    description: string;
    beforeAfter: {
      before: string;
      after: string;
    };
  }[];
  
  // Author
  author: {
    username: string;
    name: string;
  };
  
  // Lifecycle
  createdAt: string;
  updatedAt: string;
}
```

### 8.3 Popular Chain Examples

#### Example 1: Code Quality Pipeline

```json
{
  "id": "code-quality-pipeline",
  "name": "Code Quality Pipeline",
  "description": "Format → Lint → Git Stage → Generate Commit Message",
  "icon": "✨",
  
  "hooks": [
    {
      "hookId": "format-typescript",
      "order": 1,
      "config": { "printWidth": 100 },
      "optional": false
    },
    {
      "hookId": "eslint-check",
      "order": 2,
      "config": { "fix": true },
      "optional": false
    },
    {
      "hookId": "git-stage-changes",
      "order": 3,
      "config": {},
      "optional": false
    },
    {
      "hookId": "ai-commit-message",
      "order": 4,
      "config": { "conventional": true },
      "optional": true
    }
  ],
  
  "category": "Code Quality",
  "tags": ["formatting", "linting", "git", "automation"],
  "useCase": "Automatically ensure code quality and generate semantic commit messages after every code change",
  
  "popularity": 2347,
  "rating": 4.8,
  
  "installCommand": "npx hookhub install-chain code-quality-pipeline",
  
  "examples": [
    {
      "title": "TypeScript file editing",
      "description": "When you edit a .ts file, this chain automatically formats it, runs ESLint, stages the changes, and suggests a commit message",
      "beforeAfter": {
        "before": "Manual: format → lint → stage → write commit message",
        "after": "Automatic: all steps happen in sequence"
      }
    }
  ],
  
  "author": {
    "username": "hookhub-official",
    "name": "HookHub Team"
  },
  
  "createdAt": "2025-12-01T00:00:00Z",
  "updatedAt": "2026-01-15T00:00:00Z"
}
```

#### Example 2: Security Checker

```json
{
  "id": "security-scanner",
  "name": "Security Scanner",
  "description": "Secret Detection → Dependency Audit → License Check",
  "icon": "🔒",
  
  "hooks": [
    {
      "hookId": "secret-detector",
      "order": 1,
      "config": { "patterns": ["API_KEY", "PASSWORD"] },
      "optional": false
    },
    {
      "hookId": "dependency-audit",
      "order": 2,
      "config": { "severity": "high" },
      "optional": false
    },
    {
      "hookId": "license-checker",
      "order": 3,
      "config": { "allowedLicenses": ["MIT", "Apache-2.0"] },
      "optional": true
    }
  ],
  
  "category": "Security",
  "popularity": 1823,
  "useCase": "Prevent security vulnerabilities before committing code"
}
```

### 8.4 Chain Card UI

```
┌──────────────────────────────────────────────┐
│ 🔗 POPULAR HOOK WORKFLOWS                    │
├──────────────────────────────────────────────┤
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ ✨ Code Quality Pipeline               │  │
│ │ Format → Lint → Stage → Commit Msg     │  │
│ │                                        │  │
│ │ 4 hooks • 2.3k installs • ⭐ 4.8       │  │
│ │                                        │  │
│ │ [📋 Copy Config] [👁️ View Details]     │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ 🔒 Security Scanner                    │  │
│ │ Secret Check → Dependency Audit        │  │
│ │                                        │  │
│ │ 3 hooks • 1.8k installs • ⭐ 4.6       │  │
│ │                                        │  │
│ │ [📋 Copy Config] [👁️ View Details]     │  │
│ └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

### 8.5 Chain Detail Page

```
┌─────────────────────────────────────────────────┐
│ ✨ Code Quality Pipeline                        │
│ Automated workflow for maintaining code quality │
│                                                 │
│ 4 hooks • 2.3k installs • ⭐ 4.8 (142 reviews) │
│                                                 │
│ [📋 Copy Full Config]  [⭐ Save]  [🔗 Share]   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Workflow Steps                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1️⃣ Format TypeScript                            │
│    Runs Prettier on .ts and .tsx files          │
│    [View Hook →]                                │
│            ↓                                    │
│ 2️⃣ ESLint Check                                 │
│    Automatically fixes linting errors           │
│    [View Hook →]                                │
│            ↓                                    │
│ 3️⃣ Git Stage Changes                            │
│    Stages all modified files                    │
│    [View Hook →]                                │
│            ↓                                    │
│ 4️⃣ AI Commit Message (optional)                 │
│    Generates semantic commit message            │
│    [View Hook →]                                │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Configuration                                   │
├─────────────────────────────────────────────────┤
│ {                                               │
│   "hooks": [                                    │
│     {                                           │
│       "type": "PostToolUse",                    │
│       "matcher": "Write|Edit",                  │
│       "path": "~/.claude/hooks/format-ts.sh"    │
│     },                                          │
│     // ... rest of hooks                        │
│   ]                                             │
│ }                                               │
│                                                 │
│ [📋 Copy Configuration]                         │
└─────────────────────────────────────────────────┘
```

---

## 9. Submission & Quality Control

### 9.1 Submission Process

```
┌─────────────────────────────────────────────────┐
│ 📝 Submit Your Hook                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Step 1: Prepare Your Hook                      │
│ ✓ Create GitHub repository                     │
│ ✓ Write comprehensive README                   │
│ ✓ Add examples and documentation               │
│ ✓ Test on macOS/Linux/Windows                  │
│                                                 │
│ Step 2: Submit via GitHub                      │
│ 1. Fork hookhub/submissions                    │
│ 2. Add your hook.json to pending/              │
│ 3. Create Pull Request                         │
│                                                 │
│ Step 3: Automated Validation                   │
│ • Schema validation                            │
│ • Security scan                                │
│ • Dependency check                             │
│ • README completeness                          │
│                                                 │
│ Step 4: Community Review                       │
│ • Maintainer code review (2-3 days)            │
│ • Testing by community                         │
│ • Feedback and iteration                       │
│                                                 │
│ Step 5: Approval & Publication                 │
│ • 2+ maintainer approvals required             │
│ • Hook added to marketplace                    │
│ • Author notified                              │
│                                                 │
│ [View Submission Guidelines →]                  │
└─────────────────────────────────────────────────┘
```

### 9.2 Automated Validation (GitHub Action)

```yaml
# .github/workflows/validate-hook-submission.yml
name: Validate Hook Submission

on:
  pull_request:
    paths:
      - 'submissions/pending/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Validate JSON Schema
        run: |
          npx ajv validate \
            -s schema/hook.schema.json \
            -d "${{ github.event.pull_request.changed_files }}"
      
      - name: Security Scan
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high
      
      - name: Check Repository Accessibility
        run: |
          REPO_URL=$(jq -r '.github.url' hook.json)
          curl -f -s "$REPO_URL" > /dev/null
      
      - name: Validate Dependencies
        run: |
          # Check if required dependencies are valid packages
          jq -r '.dependencies.required[].name' hook.json | \
            while read dep; do
              brew info "$dep" || apt-cache show "$dep"
            done
      
      - name: Check README Completeness
        run: |
          REQUIRED_SECTIONS=(
            "Installation"
            "Usage"
            "Configuration"
            "Examples"
          )
          
          README_URL=$(jq -r '.media.readmeUrl' hook.json)
          README=$(curl -s "$README_URL")
          
          for section in "${REQUIRED_SECTIONS[@]}"; do
            echo "$README" | grep -i "## $section" || {
              echo "❌ Missing required section: $section"
              exit 1
            }
          done
      
      - name: Test Hook Execution
        run: |
          # Download and test the hook
          HOOK_PATH=$(jq -r '.github.path' hook.json)
          REPO_URL=$(jq -r '.github.url' hook.json)
          
          curl -o test-hook.sh "$REPO_URL/raw/main/$HOOK_PATH"
          chmod +x test-hook.sh
          
          # Run with test input
          ./test-hook.sh --test || {
            echo "❌ Hook execution failed"
            exit 1
          }
      
      - name: Generate Validation Report
        run: |
          echo "## Validation Results" >> $GITHUB_STEP_SUMMARY
          echo "✅ Schema validation passed" >> $GITHUB_STEP_SUMMARY
          echo "✅ Security scan passed" >> $GITHUB_STEP_SUMMARY
          echo "✅ Repository accessible" >> $GITHUB_STEP_SUMMARY
          echo "✅ Dependencies valid" >> $GITHUB_STEP_SUMMARY
          echo "✅ README complete" >> $GITHUB_STEP_SUMMARY
          echo "✅ Hook execution successful" >> $GITHUB_STEP_SUMMARY
      
      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All automated checks passed! Awaiting maintainer review.'
            })
```

### 9.3 Manual Review Checklist

**For Maintainers:**

```markdown
## Hook Review Checklist

### Code Quality
- [ ] Code is readable and well-structured
- [ ] No obvious bugs or errors
- [ ] Follows shell scripting best practices
- [ ] Error handling implemented
- [ ] Exit codes are meaningful

### Security
- [ ] No hardcoded credentials
- [ ] No `eval` or dangerous commands
- [ ] Input validation present
- [ ] File permissions checked
- [ ] No arbitrary code execution risks

### Functionality
- [ ] Hook works as described
- [ ] Tested on macOS (if applicable)
- [ ] Tested on Linux (if applicable)
- [ ] Tested on Windows (if applicable)
- [ ] Edge cases handled

### Documentation
- [ ] Clear installation instructions
- [ ] Configuration examples provided
- [ ] Use cases explained
- [ ] Troubleshooting section present
- [ ] License specified

### Community Value
- [ ] Solves a real problem
- [ ] Not duplicate of existing hook
- [ ] Useful to broader community
- [ ] Well-scoped (not too narrow/broad)

### Performance
- [ ] Execution time <500ms (or documented)
- [ ] No unnecessary dependencies
- [ ] Resource usage acceptable

### Approval
- [ ] Reviewer 1: @username ✅
- [ ] Reviewer 2: @username ✅
- [ ] Ready to merge
```

### 9.4 Approval Criteria

```typescript
interface ApprovalCriteria {
  automated: {
    schemaValid: boolean;              // MUST pass
    securityScanClean: boolean;        // MUST pass
    repoAccessible: boolean;           // MUST pass
    dependenciesValid: boolean;        // MUST pass
    readmeComplete: boolean;           // MUST pass
  };
  
  manual: {
    codeQuality: 1-5;                  // MUST be >= 3
    security: 1-5;                     // MUST be >= 4
    documentation: 1-5;                // MUST be >= 3
    communityValue: 1-5;               // MUST be >= 3
    maintainerApprovals: number;       // MUST be >= 2
  };
  
  timeline: {
    submittedAt: string;
    firstReviewAt: string;             // Within 48 hours
    approvedAt: string;                // Within 7 days
  };
}
```

### 9.5 Quality Badges & Verification

```typescript
interface QualityBadge {
  verified: {
    criteria: "Author identity confirmed via GitHub",
    icon: "✓",
    color: "blue"
  };
  
  topRated: {
    criteria: ">4.5 stars with 50+ reviews",
    icon: "🏆",
    color: "gold"
  };
  
  securityAudited: {
    criteria: "Passed Snyk security scan + manual review",
    icon: "🔒",
    color: "green"
  };
  
  fastPerformance: {
    criteria: "<100ms average execution time",
    icon: "⚡",
    color: "yellow"
  };
  
  wellDocumented: {
    criteria: "Complete README with examples",
    icon: "📚",
    color: "purple"
  };
  
  communityChoice: {
    criteria: "Top 10% of installs this month",
    icon: "💎",
    color: "cyan"
  };
}
```

---

## 10. Error Handling & Edge Cases

### 10.1 UI States

#### 10.1.1 Empty States

**No Search Results:**
```
┌─────────────────────────────────────────┐
│                                         │
│            🔍                           │
│     No hooks found for "xyz"            │
│                                         │
│     Try:                                │
│     • Check spelling                    │
│     • Use different keywords            │
│     • Remove some filters               │
│                                         │
│     Popular searches:                   │
│     [git commit] [formatter] [testing]  │
│                                         │
│     [Clear Search]  [Browse All Hooks]  │
└─────────────────────────────────────────┘
```

**No Filtered Results:**
```
┌─────────────────────────────────────────┐
│                                         │
│            🔍                           │
│  No hooks match your current filters    │
│                                         │
│  Active filters:                        │
│  • Type: PreToolUse                     │
│  • Category: Security, Testing          │
│  • Platform: Windows                    │
│                                         │
│  [Remove Some Filters]  [Clear All]     │
└─────────────────────────────────────────┘
```

**New User (No Favorites):**
```
┌─────────────────────────────────────────┐
│                                         │
│            ⭐                           │
│      No favorites yet                   │
│                                         │
│  Click the ⭐ icon on any hook card     │
│  to save it to your favorites           │
│                                         │
│     [Explore Popular Hooks →]           │
└─────────────────────────────────────────┘
```

#### 10.1.2 Loading States

**Skeleton Cards:**
```
┌──────────────────────────┐
│ ▒▒▒▒▒▒▒▒▒▒▒▒            │
│                          │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒        │
│ ▒▒▒▒▒▒▒▒  ▒▒▒▒▒         │
│ ─────────────────        │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒        │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒        │
│ ▒▒▒▒▒▒  ▒▒▒▒▒▒▒         │
└──────────────────────────┘
```

**Progressive Loading:**
```
┌─────────────────────────────────────────┐
│ Loading hooks...                         │
│ ████████████░░░░░░░░  45% (23/50)       │
└─────────────────────────────────────────┘
```

**Lazy Load Indicator:**
```
┌─────────────────────────────────────────┐
│ [Card] [Card] [Card] [Card] [Card]      │
│ [Card] [Card] [Card] [Card] [Card]      │
│                                         │
│        ⏳ Loading more hooks...         │
│                                         │
└─────────────────────────────────────────┘
```

#### 10.1.3 Error States

**GitHub API Rate Limited:**
```
┌─────────────────────────────────────────┐
│             ⚠️ Notice                   │
│                                         │
│  GitHub star counts may be outdated     │
│                                         │
│  We've hit GitHub's rate limit.         │
│  Star counts will refresh in 15 mins.   │
│                                         │
│  All other data is current.             │
│                                         │
│  [Dismiss]                              │
└─────────────────────────────────────────┘
```

**Hook Repository Deleted:**
```
┌──────────────────────────┐
│ [PreToolUse] 🛡️         │
│ bash-validator           │
│ by @username             │
│ ─────────────────────    │
│ ⚠️ Repository not found  │
│                          │
│ This hook's repository   │
│ has been deleted or      │
│ made private.            │
│                          │
│ [View Alternatives]      │
└──────────────────────────┘
```

**Installation Failed:**
```
┌─────────────────────────────────────────┐
│         ❌ Installation Failed          │
│                                         │
│  Could not download hook script.        │
│                                         │
│  Possible reasons:                      │
│  • Network connection issue             │
│  • Repository moved or deleted          │
│  • Invalid file path in config          │
│                                         │
│  [Try Again]  [Manual Install]          │
└─────────────────────────────────────────┘
```

### 10.2 Hook Deprecation

**Deprecated Hook Warning:**
```
┌──────────────────────────────────────────┐
│ ⚠️ DEPRECATED                            │
│                                          │
│ bash-validator v1.x                      │
│                                          │
│ This hook has been deprecated and        │
│ will stop working in Claude Code v0.6.0  │
│                                          │
│ Please migrate to: bash-validator-v2     │
│                                          │
│ Migration guide: [View Guide →]          │
│                                          │
│ [Install Replacement]  [Learn More]      │
└──────────────────────────────────────────┘
```

**Replacement Hook Suggestion:**
```
┌─────────────────────────────────────────┐
│  Deprecated: bash-validator             │
│                                         │
│  ✨ Try the improved version:           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ bash-validator-v2                 │ │
│  │ 2x faster, more rules, better UX  │ │
│  │ [View Details] [Install]          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Or browse similar hooks:               │
│  [shell-safety] [command-validator]     │
└─────────────────────────────────────────┘
```

### 10.3 Data Freshness

**Stale Data Warning:**
```
┌─────────────────────────────────────────┐
│ ℹ️ Data last updated: 2 hours ago       │
│ [Refresh Now]                           │
└─────────────────────────────────────────┘
```

**Cache Status Indicator:**
```
Hook Card Footer:
├─ ⭐ 234 stars
└─ 🕒 Updated 5 mins ago
```

### 10.4 Conflict Detection

**Incompatible Hooks Warning:**
```
┌─────────────────────────────────────────┐
│         ⚠️ Potential Conflict           │
│                                         │
│  You have installed:                    │
│  • bash-validator (blocks rm commands)  │
│                                         │
│  This hook also:                        │
│  • shell-safety (blocks rm commands)    │
│                                         │
│  These hooks may interfere with each    │
│  other. Consider using only one.        │
│                                         │
│  [View Compatibility Guide]             │
└─────────────────────────────────────────┘
```

---

## 11. Security & Trust

### 11.1 Hook Vetting Process

```typescript
interface SecurityVetting {
  automated: {
    staticAnalysis: {
      tool: "Snyk + ShellCheck",
      checks: [
        "No hardcoded secrets",
        "No eval or dangerous commands",
        "No arbitrary code execution",
        "Input validation present"
      ]
    };
    
    dependencyScan: {
      tool: "npm audit + Snyk",
      checks: [
        "No high/critical CVEs",
        "Dependencies up to date",
        "Licenses compatible"
      ]
    };
    
    codeReview: {
      tool: "GitHub CodeQL",
      checks: [
        "No injection vulnerabilities",
        "Proper error handling",
        "Safe file operations"
      ]
    };
  };
  
  manual: {
    maintainerReview: {
      reviewers: 2,
      focus: [
        "Logic correctness",
        "Edge case handling",
        "Security best practices",
        "Performance impact"
      ]
    };
    
    communityTesting: {
      period: "7 days beta",
      testers: "10+ community members",
      feedback: "Required before approval"
    };
  };
}
```

### 11.2 User Safety Measures

**Sandboxed Preview (Phase 3):**
```typescript
interface SandboxPreview {
  environment: "Docker container";
  restrictions: [
    "No network access",
    "Read-only filesystem",
    "Limited memory (512MB)",
    "Timeout after 5 seconds"
  ];
  
  userControls: {
    inputData: "User provides test input",
    observeOutput: "See stdout/stderr",
    checkFileChanges: "Diff view"
  };
}
```

**Permission Warnings:**
```
┌─────────────────────────────────────────┐
│         🛡️ Permissions Required         │
│                                         │
│  This hook needs:                       │
│  • Read/write access to ~/.claude/      │
│  • Execute git commands                 │
│  • Network access (GitHub API)          │
│                                         │
│  ⚠️ Only install hooks you trust        │
│                                         │
│  [View Code on GitHub]  [Cancel]        │
│  [I Understand, Install]                │
└─────────────────────────────────────────┘
```

### 11.3 Malicious Code Detection

```typescript
interface MaliciousPatterns {
  blocked: [
    "curl * | bash",           // Arbitrary remote execution
    "wget -O- * | sh",
    "rm -rf /",                // Destructive commands
    "dd if=/dev/zero",
    ":(){ :|:& };:",           // Fork bomb
    "eval $(curl",             // Remote code eval
    "base64 -d | bash",        // Obfuscated execution
    "nc -e /bin/sh",           // Reverse shell
  ];
  
  flagged: [
    "sudo ",                   // Elevated privileges
    "chmod 777",               // Insecure permissions
    "password",                // Potential credential leak
    "API_KEY",
    "/etc/passwd",             // System file access
  ];
}
```

### 11.4 Author Verification

```typescript
interface AuthorVerification {
  requirements: {
    githubAccount: {
      age: ">= 6 months",
      twoFactorAuth: "required",
      emailVerified: true
    };
    
    reputation: {
      minContributions: 10,
      minRepos: 3,
      noSecurityIncidents: true
    };
  };
  
  verificationProcess: {
    step1: "Link GitHub account",
    step2: "Confirm email",
    step3: "Review by maintainers",
    step4: "Badge granted"
  };
  
  badge: {
    display: "✓ Verified Author",
    color: "blue",
    tooltip: "Identity confirmed, trusted contributor"
  };
}
```

### 11.5 Incident Response

**Security Issue Reporting:**
```
┌─────────────────────────────────────────┐
│       🔒 Report Security Issue          │
│                                         │
│  Found a security vulnerability?        │
│                                         │
│  Please report responsibly:             │
│  📧 security@hookhub.dev                │
│                                         │
│  Do NOT create public GitHub issues     │
│  for security vulnerabilities.          │
│                                         │
│  We'll respond within 24 hours and      │
│  work with you to resolve the issue.    │
│                                         │
│  [Email Security Team]                  │
└─────────────────────────────────────────┘
```

**Vulnerability Disclosure:**
```
┌─────────────────────────────────────────┐
│      ⚠️ Security Advisory               │
│                                         │
│  Hook: bash-validator v1.2.0            │
│  Severity: HIGH                         │
│                                         │
│  Issue: Command injection via unescaped │
│  user input in validator.sh line 42     │
│                                         │
│  Fix: Update to v1.2.1 immediately      │
│                                         │
│  [Update Now]  [View Details]           │
└─────────────────────────────────────────┘
```

### 11.6 Trust Indicators

**Hook Card Trust Score:**
```
┌──────────────────────────┐
│ [PreToolUse] 🛡️         │
│ bash-validator           │
│ by @awesome-dev          │
│ ─────────────────────    │
│ Trust Score: 95/100      │
│ ✓ Verified author        │
│ ✓ Security audited       │
│ ✓ 1.2k installs          │
│ ✓ Active maintenance     │
│ ✓ Open source            │
└──────────────────────────┘
```

---

## 12. Hook Creator's Guide

### 12.1 Getting Started

```markdown
# Hook Creator's Guide

## Prerequisites
- GitHub account (6+ months old)
- Basic shell scripting knowledge
- Understanding of Claude Code hooks API

## Step 1: Plan Your Hook

### Ask yourself:
1. What problem does this solve?
2. Which hook type is appropriate?
3. What are the dependencies?
4. What platforms will it support?

### Check for duplicates:
- Search existing hooks on HookHub
- Check if a similar hook exists
- Consider contributing to existing hook instead

## Step 2: Create Repository

### Repository structure:
```
my-awesome-hook/
├── src/
│   └── hook.sh              # Main hook script
├── tests/
│   └── test-hook.sh         # Automated tests
├── examples/
│   └── example-config.json  # Usage examples
├── README.md                # Comprehensive documentation
├── LICENSE                  # MIT or Apache 2.0 recommended
└── .github/
    └── workflows/
        └── test.yml         # CI/CD pipeline
```

### Required README sections:
- Installation
- Configuration
- Usage Examples
- Troubleshooting
- Contributing
- License

## Step 3: Write Your Hook

### Best Practices:

#### ✅ DO:
- Validate all inputs
- Handle errors gracefully
- Exit with meaningful codes
- Log important actions
- Make it configurable
- Keep it focused (single responsibility)
- Use shellcheck for linting
- Add comments for complex logic

#### ❌ DON'T:
- Use `eval` with user input
- Make assumptions about file paths
- Ignore errors (check return codes)
- Hardcode credentials
- Make network calls without timeout
- Modify system files
- Run as root unless absolutely necessary

### Template:
```bash
#!/usr/bin/env bash
set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Hook: my-awesome-hook
# Type: PreToolUse
# Description: Brief description

# Configuration (with defaults)
CONFIG_VAR="${CONFIG_VAR:-default_value}"

# Logging
log_info() { echo "[INFO] $*" >&2; }
log_error() { echo "[ERROR] $*" >&2; }

# Main logic
main() {
  # Input validation
  if [[ -z "${1:-}" ]]; then
    log_error "Missing required argument"
    exit 1
  fi
  
  # Hook logic here
  
  # Success
  exit 0
}

# Run main function
main "$@"
```

## Step 4: Test Thoroughly

### Testing checklist:
- [ ] Works on macOS
- [ ] Works on Linux
- [ ] Works on Windows (if applicable)
- [ ] Handles edge cases
- [ ] Fails gracefully
- [ ] Performance acceptable (<500ms)

### Automated tests:
```bash
#!/usr/bin/env bash
# tests/test-hook.sh

test_basic_functionality() {
  ./src/hook.sh "test input"
  assertEquals "Exit code should be 0" 0 $?
}

test_invalid_input() {
  ./src/hook.sh ""
  assertEquals "Exit code should be 1" 1 $?
}

# Run tests
source shunit2  # or your testing framework
```

## Step 5: Write Documentation

### README.md template:
```markdown
# My Awesome Hook

Brief description of what this hook does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation

### Quick Install
\`\`\`bash
curl -fsSL https://hookhub.dev/install/my-hook | bash
\`\`\`

### Manual Install
\`\`\`bash
# Step 1: Download hook
curl -o ~/.claude/hooks/my-hook.sh https://...

# Step 2: Make executable
chmod +x ~/.claude/hooks/my-hook.sh

# Step 3: Add to config
# Add this to ~/.claude/config.json:
{
  "hooks": [{
    "type": "PreToolUse",
    "matcher": "Bash",
    "path": "~/.claude/hooks/my-hook.sh"
  }]
}
\`\`\`

## Configuration

### Basic
\`\`\`json
{
  "hooks": [{
    "type": "PreToolUse",
    "path": "~/.claude/hooks/my-hook.sh"
  }]
}
\`\`\`

### Advanced
\`\`\`json
{
  "hooks": [{
    "type": "PreToolUse",
    "path": "~/.claude/hooks/my-hook.sh",
    "config": {
      "option1": "value1",
      "option2": "value2"
    }
  }]
}
\`\`\`

## Usage

Describe typical workflows where this hook is useful.

## Examples

### Example 1: Basic Usage
\`\`\`bash
# Scenario description
# Expected behavior
\`\`\`

## Troubleshooting

### Issue 1: Hook not running
- Check file permissions: `ls -l ~/.claude/hooks/my-hook.sh`
- Verify config syntax

## Contributing

Contributions welcome! Please open an issue first.

## License

MIT
```

## Step 6: Submit to HookHub

1. Fork [hookhub/submissions](https://github.com/hookhub/submissions)
2. Create `submissions/pending/your-hook.json`:

\`\`\`json
{
  "id": "my-awesome-hook",
  "name": "My Awesome Hook",
  "description": "Brief description (2-3 sentences)",
  "github": {
    "url": "https://github.com/username/my-hook",
    "owner": "username",
    "repo": "my-hook",
    "path": "src/hook.sh"
  },
  "metadata": {
    "version": "1.0.0",
    "hookTypes": ["PreToolUse"],
    "matchers": ["Bash"],
    "category": "Security",
    "tags": ["validation", "security"],
    "difficulty": "beginner"
  },
  "quickStart": {
    "installCommand": "curl ... | bash",
    "configSnippet": "...",
    "setupTime": 5
  },
  "dependencies": {
    "required": [
      {
        "name": "jq",
        "version": ">=1.6",
        "installInstructions": {
          "macos": "brew install jq",
          "linux": "apt install jq",
          "windows": "choco install jq"
        }
      }
    ]
  },
  "compatibility": {
    "minVersion": "0.3.0",
    "platforms": ["macos", "linux"]
  },
  "author": {
    "name": "Your Name",
    "username": "github-username",
    "avatar": "https://github.com/username.png",
    "url": "https://github.com/username"
  }
}
\`\`\`

3. Create Pull Request
4. Wait for automated validation
5. Respond to maintainer feedback
6. Get approved! 🎉

## Quality Criteria

Your hook will be evaluated on:

### Code Quality (40%)
- Readable, well-structured code
- Proper error handling
- Input validation
- Performance optimization

### Documentation (30%)
- Clear installation instructions
- Configuration examples
- Use case descriptions
- Troubleshooting guide

### Testing (15%)
- Works on claimed platforms
- Edge cases handled
- Automated tests present

### Security (15%)
- No hardcoded secrets
- Safe file operations
- Input sanitization
- Least privilege principle

## Tips for Getting Featured

1. **Solve a real problem**: Address a common pain point
2. **Polish the UX**: Clear error messages, helpful defaults
3. **Write great docs**: Examples, GIFs, troubleshooting
4. **Engage with users**: Respond to issues, incorporate feedback
5. **Keep it maintained**: Regular updates, bug fixes

## Support

- 💬 Discord: [HookHub Community](https://discord.gg/hookhub)
- 📧 Email: creators@hookhub.dev
- 📚 Docs: https://docs.hookhub.dev
```

### 12.2 Hook Development Checklist

**Pre-Submission:**
```
Development
[ ] Hook solves a specific problem
[ ] Code is clean and well-commented
[ ] shellcheck passes with no warnings
[ ] Automated tests pass
[ ] Works on macOS
[ ] Works on Linux
[ ] Works on Windows (if applicable)
[ ] Performance tested (<500ms)

Documentation
[ ] README is comprehensive
[ ] Installation steps are clear
[ ] Configuration examples provided
[ ] Use cases described
[ ] Troubleshooting section included
[ ] License file present

Security
[ ] No hardcoded secrets
[ ] Input validation implemented
[ ] Error handling robust
[ ] Follows principle of least privilege
[ ] Dependencies security-scanned

Repository
[ ] Public GitHub repository
[ ] Meaningful commit messages
[ ] Tagged release (v1.0.0)
[ ] GitHub Actions CI set up
[ ] Issue template created

Submission
[ ] hook.json created correctly
[ ] All required fields filled
[ ] Tested with schema validator
[ ] Pull request opened
[ ] Responded to automated checks
```

---

## 13. MVP Implementation Plan

### 13.1 Phase 1: Core Marketplace (Weeks 1-2)

**Goal:** Functional marketplace with 15-20 curated hooks

**Tasks:**
```
Week 1: Foundation
[ ] Day 1-2: Next.js setup
  - npx create-next-app@latest hookhub --typescript --tailwind
  - Configure Tailwind + Radix UI
  - Set up file structure
  - Deploy skeleton to Vercel

[ ] Day 3-4: Data layer
  - Create Hook interface
  - Build hooks.json with 5 sample hooks
  - Implement getHooks(), filterHooks(), searchHooks()
  - Add Fuse.js for search

[ ] Day 5: Components
  - Build HookCard component
  - Build HookGrid component
  - Responsive layout (5/3/1 columns)

Week 2: Features
[ ] Day 1: Search & filters
  - SearchBar with debounce
  - QuickFilters (pill buttons)
  - Type and category filters

[ ] Day 2: Homepage sections
  - Featured hooks section
  - Most Popular section
  - Recently Added section
  - Category sections

[ ] Day 3: Hook detail page
  - Create [id]/page.tsx
  - Display full hook information
  - Copy Install button
  - GitHub link

[ ] Day 4: Polish & testing
  - Loading states
  - Error states
  - Mobile responsiveness
  - Performance optimization

[ ] Day 5: Launch prep
  - Add 15 real hooks to hooks.json
  - SEO meta tags
  - Analytics (Vercel Analytics)
  - Deploy to production
```

**Deliverables:**
- ✅ Working marketplace at hookhub.dev
- ✅ 15-20 curated hooks
- ✅ Search and filtering
- ✅ Mobile-responsive
- ✅ <2s load time

### 13.2 Phase 2: Enhanced Discovery (Weeks 3-4)

**Goal:** Improved UX and live data

**Tasks:**
```
Week 3: Data enhancement
[ ] GitHub API integration
  - Fetch stars, forks, issues
  - Cache in Vercel KV (1 hour TTL)
  - Fallback to JSON data

[ ] Advanced filtering
  - Platform filter (macOS/Linux/Windows)
  - Difficulty filter
  - Verified authors only
  - Min stars threshold

[ ] Sort options
  - Most popular (stars)
  - Recently added (createdAt)
  - Trending (velocity)
  - Alphabetical

Week 4: UX improvements
[ ] Hook chains feature
  - Add chains.json
  - Build HookChainCard
  - Chain detail pages

[ ] Installation experience
  - Improved InstallModal
  - Copy button with toast
  - Installation verification steps

[ ] Community features (prep)
  - Star/favorite (localStorage)
  - Share button
  - Related hooks

[ ] Performance
  - Lazy loading (react-window)
  - Image optimization
  - Bundle size <150KB
```

**Deliverables:**
- ✅ Live GitHub data
- ✅ Advanced filters
- ✅ Hook chains
- ✅ Improved installation UX

### 13.3 Phase 3: Community Features (Weeks 5-6)

**Goal:** Enable community submissions

**Tasks:**
```
Week 5: Authentication & submissions
[ ] Supabase setup
  - PostgreSQL database
  - Auth (GitHub OAuth)
  - User profiles

[ ] Submission flow
  - /submit form
  - GitHub issue creation
  - Automated validation (GitHub Action)

[ ] User features
  - My Favorites (persisted)
  - My Submissions
  - Author profiles

Week 6: Reviews & engagement
[ ] Rating system
  - Star ratings (1-5)
  - Review comments
  - Helpful votes

[ ] Notifications
  - Email for submission updates
  - RSS feed for new hooks

[ ] Analytics dashboard (maintainers)
  - Hook popularity trends
  - Search analytics
  - Submission pipeline
```

**Deliverables:**
- ✅ User authentication
- ✅ Hook submission workflow
- ✅ Rating and reviews
- ✅ Community engagement

### 13.4 Tech Stack Summary

**Phase 1 (MVP):**
```typescript
{
  frontend: "Next.js 14 + TypeScript + Tailwind",
  data: "Static JSON + Fuse.js",
  hosting: "Vercel",
  analytics: "Vercel Analytics"
}
```

**Phase 2:**
```typescript
{
  cache: "Vercel KV",
  github: "GitHub REST API",
  search: "Enhanced Fuse.js",
  monitoring: "Vercel Speed Insights"
}
```

**Phase 3:**
```typescript
{
  database: "Supabase (PostgreSQL)",
  auth: "Supabase Auth (GitHub OAuth)",
  storage: "Supabase Storage",
  realtime: "Supabase Realtime",
  email: "Resend"
}
```

---

## 14. Success Metrics

### 14.1 Launch Goals (Month 1)

**Traffic:**
- 100+ unique visitors
- 500+ page views
- 2+ minutes average session
- <3s average load time

**Engagement:**
- 50+ hook detail views
- 30+ "Copy Install" clicks
- 20+ GitHub repo visits
- 10+ search queries

**Content:**
- 20 curated hooks published
- 5 hook chains created
- All hooks tested and verified

**Community:**
- 5 GitHub stars on repo
- 2 community submissions
- 1 contribution from external dev

### 14.2 Growth Goals (Month 3)

**Traffic:**
- 500+ unique visitors/month
- 2,000+ page views/month
- 3+ minutes average session
- 80%+ return visitor rate

**Engagement:**
- 200+ installs (via copy button)
- 100+ favorites saved
- 50+ shares (social/Discord)
- 30+ search queries daily

**Content:**
- 50 hooks published
- 10 hook chains
- 10 verified authors
- 5 featured hooks rotated

**Community:**
- 20+ community submissions reviewed
- 10+ hooks from community
- 50+ GitHub stars
- Active Discord community

### 14.3 Quality Metrics

**Performance:**
- Lighthouse score: >90
- First Contentful Paint: <1s
- Time to Interactive: <2.5s
- Bundle size: <150KB

**Reliability:**
- 99.9% uptime
- Zero security incidents
- <1% error rate
- <100ms API response time

**User Satisfaction:**
- >4.5 stars average rating
- <5% bounce rate
- >60% return rate within 7 days
- Positive feedback in surveys

### 14.4 Business Goals (Month 6+)

**Adoption:**
- 2,000+ monthly active users
- 100+ hooks published
- 50+ verified authors
- Featured in Claude Code newsletter

**Ecosystem:**
- Integration with Claude Code CLI
- Mentioned in official docs
- Partnerships with hook creators
- Sponsor/donation model

---

## 15. Open Questions & Future Work

### 15.1 Questions to Resolve

1. **Branding & Legal**
   - Final name: "HookHub" or alternatives?
   - Domain: hookhub.dev, hookhub.com, or claudehooks.dev?
   - Trademark considerations

2. **Monetization**
   - Free forever, or premium features?
   - Sponsored hooks?
   - Donation model for creators?

3. **Governance**
   - Who can approve hooks?
   - Community moderators?
   - Voting system for featured hooks?

4. **Technical Decisions**
   - Host on Vercel, Cloudflare, or self-hosted?
   - Use GitHub as CMS or separate database?
   - CLI tool: npx, brew, or curl?

### 15.2 Future Enhancements (Backlog)

**Developer Tools:**
- VS Code extension for browsing hooks
- Claude Code native integration
- Hook testing playground (sandbox)
- Hook generator (interactive form)

**Discovery:**
- AI-powered hook recommendations
- Similar hooks based on code analysis
- Hook compatibility checker
- Trending algorithm (velocity-based)

**Collaboration:**
- Team workspaces
- Shared hook collections
- Collaborative reviews
- Hook request board

**Advanced Features:**
- Hook dependencies/composition graph
- Performance profiling dashboard
- A/B testing for hooks
- Automated update notifications

**Enterprise:**
- Private hook marketplace
- Self-hosted option
- SSO integration
- Audit logging

---

## 16. Appendix

### 16.1 Glossary

- **Hook**: Script that runs at specific points in Claude Code lifecycle
- **Matcher**: Pattern to determine when hook runs (e.g., "Bash", "Write")
- **Chain**: Sequence of hooks that run together
- **Curator**: Maintainer who reviews and approves hooks
- **Featured**: Highlighted hook on homepage
- **Verified**: Author identity confirmed

### 16.2 Related Resources

- [Claude Code Documentation](https://docs.claude.com)
- [Hooks API Reference](https://docs.claude.com/hooks)
- [HookHub GitHub](https://github.com/hookhub)
- [Community Discord](https://discord.gg/hookhub)

### 16.3 Acknowledgments

- Claude Code team at Anthropic
- Early hook creators
- Community testers
- Design inspiration: GitHub Marketplace, VS Code Extensions

---

**Document Status:** Ready for Implementation  
**Next Steps:**
1. Approve specification
2. Create GitHub repository
3. Begin Phase 1 development
4. Launch MVP in 2 weeks

**Maintainers:**
- TBD

**Contributing:**
This spec is open source. Suggest improvements via PR!

**License:** CC BY 4.0