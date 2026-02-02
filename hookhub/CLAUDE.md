# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

HookHub is a community-driven marketplace for discovering and browsing Claude Code hooks. This is a Next.js application currently undergoing transformation from a basic MVP to a full-stack production platform with enhanced UI, API routes, database integration, and GitHub authentication.

**Current State:** Phase 1 implementation in progress - enhanced type system and mock data complete, UI components and backend features in development.

**Planned Architecture:** Full-stack Next.js App Router application with PostgreSQL, Redis caching, GitHub API integration, and comprehensive search capabilities.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## High-Level Architecture

### Data Flow Pattern

**Current (MVP):**
Static JSON → Client Component → Local State (useState) → Filtered Display

**Target (Full-Stack):**
PostgreSQL → API Routes → Server Components → Client Components (with Zustand for complex state)

### Component Architecture

**State Management Strategy:**
- **Server Components** (default): Main page, detail pages - fetch data server-side, no client state
- **Client Components** (`"use client"`): Interactive elements like filters, search, modals
- **Zustand Store** (planned): Global filter state, user preferences, complex UI state

**Key Pattern - HookGrid:**
```typescript
// Client component that manages local filtering state
// Receives hooks data as props from Server Component parent
// Uses useMemo for performance optimization of filtering logic
// Composes CategoryFilter, SearchBar, and HookCard components
```

### Type System Evolution

**Important:** The type system has been significantly enhanced beyond the MVP spec:

**MVP Types** (documented in memory/spec/CLAUDE.md):
```typescript
interface Hook {
  id, name, category, description, repoUrl, repoOwner, repoName
  stars?, lastUpdated? // Optional
}
```

**Enhanced Types** (current implementation in types/):
```typescript
interface Hook {
  // Core fields (same as MVP)
  // NEW: Rich metadata
  github: { stars, forks, issues, lastSync }
  metadata: { version, hookTypes, matchers, tags, license, keywords }
  stats: { installs, dailyActive, rating, reviews, views }
  compatibility: { platforms, dependencies }
  quality: { verified, communityChoice, securityAudited, documentationScore }
  author: { username, name, avatarUrl, isVerified, reputation }
  createdAt, updatedAt, publishedAt
}
```

**Additional Type Files:**
- `types/user.ts` - User, Role, Permission interfaces for authentication
- `types/installation.ts` - Installation and Review interfaces for user interactions
- `types/api.ts` - API response types (HooksResponse, HookDetailResponse, etc.)

### Mock Data Structure

The `app/data/hooks.json` file contains 22 fully-populated hooks with realistic data:
- GitHub stats (stars ranging 143-487, forks, issues)
- Semantic versions (1.x.x, 2.x.x)
- 3-6 tags per hook (formatting, security, git, etc.)
- Quality metrics (verified status, documentation scores 68-97)
- Author information with reputation scores
- Dependencies with install commands
- Platform compatibility (mostly "All", some specific)

**Key Authors in Dataset:**
- disler (reputation: 2847) - format-typescript, session-logger, context-compactor
- johnlindquist (reputation: 3421) - typescript-type-check, ai-code-review, code-complexity-analyzer
- ChrisWiles (reputation: 1523) - activity-logger, cleanup-temp-files, prompt-validator

### UI Component Patterns

**Component Composition:**
```
page.tsx (Server Component)
  └─> HookGrid (Client Component)
      ├─> SearchBar (Client Component)
      ├─> CategoryFilter (Client Component)
      └─> HookCard[] (Presentational Component)
```

**Styling Conventions:**
- Tailwind CSS 4 exclusively - no custom CSS files except globals.css
- Color-coded category badges using Tailwind palette (blue-100/800, green-100/800, etc.)
- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (MVP), planned: `xl:grid-cols-5` (enhanced)
- Geist Sans font (already configured in layout.tsx via next/font/google)
- Dark mode support planned using next-themes

**Accessibility Requirements:**
- Semantic HTML: `<article>`, `<nav>`, `<main>`
- ARIA labels on interactive elements
- Keyboard navigation: `/` for search focus, Tab order, Enter/Escape
- Focus indicators: 2px outline on all interactive elements
- WCAG 2.1 AA contrast ratios (4.5:1 for text)

### Filtering & Search Logic

**Implementation Pattern:**
```typescript
// Two-stage filtering with useMemo optimization
const filteredHooks = useMemo(() => {
  let filtered = hooks;

  // Stage 1: Category filter (exact match)
  if (selectedCategory !== "All") {
    filtered = filtered.filter(hook => hook.category === selectedCategory);
  }

  // Stage 2: Search query (multi-field, case-insensitive)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(hook =>
      hook.name.toLowerCase().includes(query) ||
      hook.description.toLowerCase().includes(query) ||
      hook.repoName.toLowerCase().includes(query) ||
      hook.repoOwner.toLowerCase().includes(query)
    );
  }

  return filtered;
}, [hooks, selectedCategory, searchQuery]);
```

**Enhanced Search (Planned):**
- Debounced search with 300ms delay
- Search expanded to: tags, fullDescription, author fields
- Fuzzy matching with score-based ranking
- Search API endpoint with MeiliSearch integration

### Hook Categories

13 categories defined in `HookCategory` enum:
- **Lifecycle**: PreToolUse, PostToolUse, SessionStart, SessionEnd, Stop
- **Context**: UserPromptSubmit, PermissionRequest, SubagentStop, PreCompact
- **User-Facing**: Notification
- **Meta**: Utility, Workflow, Other

**Category Badge Colors:**
- PreToolUse: `bg-blue-100 text-blue-800`
- PostToolUse: `bg-green-100 text-green-800`
- SessionStart/End: `bg-purple-100 text-purple-800`
- Workflow: `bg-orange-100 text-orange-800`
- Utility: `bg-gray-100 text-gray-800`
- Other: `bg-slate-100 text-slate-800`

## Planned Features (Roadmap)

### Phase 1: Frontend MVP Enhancement (In Progress)
- Enhanced type system ✅
- Comprehensive mock data ✅
- New UI components: SortDropdown, FilterPanel, QualityBadge, InstallSnippet, DependencyList, RatingStars, ThemeToggle
- Enhanced existing components: HookCard hover states, HookGrid 5-column layout with sorting
- Hook detail pages: `/hooks/[id]` with full metadata, installation instructions, reviews
- Zustand state management for filters
- Dark mode with next-themes
- Full accessibility implementation

### Phase 2: API Routes & Server Patterns
- API routes: `/api/hooks`, `/api/hooks/[id]`, `/api/categories`, `/api/search`
- Server Components migration for initial data loading
- Loading states and error boundaries
- API response types and error handling

### Phase 3: Full Backend Implementation
- PostgreSQL with Prisma ORM
- NextAuth.js with GitHub OAuth
- GitHub API integration (live stats, webhooks)
- Redis caching layer
- MeiliSearch for advanced search
- Bull queue for background jobs (repo syncing)
- Rate limiting
- Automated validation pipeline for submitted hooks
- Sentry error tracking

## Code Style Guidelines

Following conventions from `memory/frontend/CLAUDE.md`:

### React/Next.js Patterns
- Use early returns for better readability
- Prefer `const` arrow functions: `const handleClick = () => {}`
- Client components: mark with `"use client"` directive at top
- Server components: default, no directive needed
- Event handlers: prefix with `handle` (handleClick, handleKeyDown, handleSubmit)

### TypeScript
- Define types/interfaces for all props and state
- Use type imports: `import type { Metadata } from "next"`
- Avoid `any` - use `unknown` or proper types
- Leverage type inference where obvious

### Tailwind CSS
- Never use inline styles or CSS-in-JS
- Use Tailwind classes exclusively
- Responsive: mobile-first with `sm:`, `md:`, `lg:`, `xl:` prefixes
- Dark mode: `dark:` prefix (when implemented)
- Utility-first: compose complex styles from utilities

### Accessibility
- `tabindex="0"` on custom interactive elements
- `aria-label` for icon-only buttons
- `onClick` + `onKeyDown` handlers together
- Semantic HTML elements over divs

## File Organization

```
hookhub/
├── app/
│   ├── components/           # React components
│   │   ├── HookCard.tsx     # Individual hook display
│   │   ├── HookGrid.tsx     # Grid + filter orchestration (client)
│   │   ├── CategoryFilter.tsx
│   │   └── SearchBar.tsx
│   ├── data/
│   │   └── hooks.json       # 22 hooks with enhanced mock data
│   ├── hooks/[id]/          # Hook detail pages (planned)
│   ├── api/                 # API routes (planned)
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main page
│   └── globals.css          # Global Tailwind styles
├── types/
│   ├── hook.ts              # Core Hook interface + enums
│   ├── user.ts              # User, Role, Permission
│   ├── installation.ts      # Installation, Review
│   └── api.ts               # API response types
├── lib/                     # Utilities (planned)
│   ├── store.ts            # Zustand state management
│   ├── prisma.ts           # Prisma client singleton
│   ├── auth.ts             # NextAuth utilities
│   └── api.ts              # API client functions
├── prisma/                  # Database schema (planned)
├── memory/                  # Project documentation
│   ├── spec/CLAUDE.md      # MVP specification (reference)
│   └── frontend/CLAUDE.md  # Frontend coding guidelines
└── public/                  # Static assets
```

## Important Architectural Decisions

### Why Client Component for HookGrid?
Despite Next.js App Router preference for Server Components, HookGrid is a Client Component because:
- Manages interactive filter state (selectedCategory, searchQuery)
- Re-renders on every keystroke (search) - needs useState hooks
- No data fetching - receives hooks as props from Server Component parent

### Data Fetching Strategy
**Current:** Static import from JSON
**Target:** Server Component fetches from API → passes to Client Component as props
- Initial page load: Server-side rendering with full SEO
- Filtering/search: Client-side for instant feedback
- Detail pages: Server-side fetching with Suspense boundaries

### Why Zustand Instead of Context API?
For complex filter state (multi-select tags, quality filters, sort options):
- No provider wrapper needed
- Better performance (no re-render of entire tree)
- DevTools support
- Persistence middleware for user preferences

### Database Choice: PostgreSQL
- Relational data (users, hooks, reviews, installations)
- JSON column support for flexible metadata
- Full-text search capabilities
- Prisma ORM has excellent TypeScript integration

## Adding New Hooks to JSON

Current structure requires all enhanced fields:

```json
{
  "id": "23",
  "name": "new-hook-name",
  "category": "PostToolUse",
  "description": "Brief description (2-3 lines)",
  "fullDescription": "Detailed explanation with use cases",
  "repoUrl": "https://github.com/username/repo",
  "repoOwner": "username",
  "repoName": "repo",
  "github": {
    "stars": 150,
    "forks": 25,
    "issues": 3,
    "lastSync": "2026-02-02T12:00:00Z"
  },
  "metadata": {
    "version": "1.0.0",
    "hookTypes": ["PostToolUse"],
    "matchers": ["Write", "Edit"],
    "tags": ["tag1", "tag2", "tag3"],
    "license": "MIT",
    "keywords": ["keyword1", "keyword2"]
  },
  "stats": {
    "installs": 100,
    "dailyActive": 50,
    "rating": 4.5,
    "reviews": 20,
    "views": 500
  },
  "compatibility": {
    "platforms": ["All"],
    "dependencies": [
      {
        "name": "tool-name",
        "version": "^1.0.0",
        "required": true,
        "installCommand": "npm install -D tool-name"
      }
    ]
  },
  "quality": {
    "verified": false,
    "communityChoice": false,
    "securityAudited": false,
    "documentationScore": 75
  },
  "author": {
    "username": "username",
    "name": "Full Name",
    "avatarUrl": "https://github.com/username.png",
    "isVerified": false,
    "reputation": 100
  },
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-02-01T15:00:00Z",
  "publishedAt": "2026-01-16T09:00:00Z"
}
```

## Dependencies

### Current Production Dependencies
- `next` 16.1.6 - Framework (App Router)
- `react` 19.2.3, `react-dom` 19.2.3
- `zustand` 5.0.11 - State management
- `next-themes` 0.4.6 - Dark mode
- `clsx` 2.1.1 - Conditional class names
- `lucide-react` 0.563.0 - Icon library
- `react-markdown` 10.1.0, `remark-gfm` 4.0.1 - Markdown rendering
- `@radix-ui/react-*` - Accessible UI primitives (dropdown, dialog, checkbox)

### Planned Backend Dependencies
- `prisma`, `@prisma/client` - ORM
- `next-auth`, `@next-auth/prisma-adapter` - Authentication
- `@octokit/rest` - GitHub API
- `ioredis`, `bull` - Caching and job queue
- `meilisearch` - Search engine
- `@sentry/nextjs`, `pino` - Monitoring and logging

## Key Memory Files

- `memory/spec/CLAUDE.md` - Original MVP specification (reference for project goals)
- `memory/frontend/CLAUDE.md` - Frontend coding guidelines and patterns
- This file (CLAUDE.md) - Active development guidance

**Note:** If memory files conflict with this file, this CLAUDE.md takes precedence as it reflects current implementation state.

## Testing Checklist (Before Committing)

**Visual:**
- Grid displays all 22 hooks
- Category filtering works instantly
- Search filters correctly across name, description, repo
- Responsive layout: 1-col mobile, 2-col tablet, 3-col desktop
- Category badges display correct colors

**Performance:**
- No console errors
- Page loads < 2 seconds
- Filtering/search feels instant (no lag)
- useMemo prevents unnecessary re-renders

**Accessibility:**
- Keyboard navigation works
- Focus indicators visible
- Screen reader announces results count
- Color contrast meets WCAG 2.1 AA

## Resources

- [Project Specification](memory/spec/CLAUDE.md) - MVP requirements
- [Frontend Guidelines](memory/frontend/CLAUDE.md) - React/Next.js patterns
- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs) (for Phase 3)
