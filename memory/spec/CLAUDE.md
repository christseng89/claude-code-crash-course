# HookHub - Project Specification (MVP)

**Version:** 1.0
**Date:** 2026-01-26
**Status:** Draft

## 1. Project Overview

HookHub is a community-driven platform for discovering and browsing open-source Claude Code hooks. The MVP focuses on providing a clean, searchable directory of hooks sourced from GitHub repositories, displayed in an intuitive grid interface.

### What are Claude Hooks?

Claude Code hooks are automation scripts that execute at specific points during Claude Code's operation lifecycle (e.g., PreToolUse, PostToolUse, SessionStart, SessionEnd). They enable workflow automation, policy enforcement, and external tool integration.

## 2. Project Goals

### Primary Goals (MVP)
- **Discovery:** Help developers find useful Claude hooks for their workflows
- **Browsing:** Provide an easy way to explore hooks by category
- **Accessibility:** Make it simple to access the source code on GitHub

### Success Metrics
- Display at least 20+ curated hooks at launch
- Grid view loads in under 2 seconds
- Mobile-responsive design that works on all devices

## 3. Data Model

### Hook Entity

```typescript
interface Hook {
  id: string;                  // Unique identifier (generated)
  name: string;                // Hook name (e.g., "format-typescript")
  category: HookCategory;      // Hook type/category
  description: string;         // Brief description (max 200 chars)
  repoUrl: string;            // Full GitHub repository URL
  repoOwner: string;          // GitHub username/org (extracted from URL)
  repoName: string;           // Repository name (extracted from URL)
  stars?: number;             // GitHub stars (optional, future feature)
  lastUpdated?: string;       // Last commit date (optional, future feature)
}

enum HookCategory {
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
  Utility = "Utility",           // Helper scripts/utilities
  Workflow = "Workflow",         // Multi-hook workflows
  Other = "Other"
}
```

## 4. MVP Features

### 4.1 Main Page - Hook Grid View

**Layout:**
- Responsive grid layout (3 columns desktop, 2 columns tablet, 1 column mobile)
- Each card displays: name, category badge, description, GitHub link
- Category badges color-coded for quick visual identification

**Hook Card Design:**
```
┌─────────────────────────────────────┐
│ [Category Badge]                    │
│                                     │
│ Hook Name                           │
│ Brief description text that might   │
│ span multiple lines...              │
│                                     │
│ [View on GitHub →]                  │
└─────────────────────────────────────┘
```

### 4.2 Category Filter

**Requirements:**
- Horizontal category filter bar above the grid
- "All" option to show all hooks (default)
- Clicking a category filters the grid instantly (client-side)
- Active category highlighted

**Categories to Display:**
- All (default)
- PreToolUse
- PostToolUse
- SessionStart/SessionEnd
- Workflows
- Utilities
- Other

### 4.3 Search Functionality

**Requirements:**
- Search bar at the top of the page
- Real-time filtering as user types
- Search across: hook name, description, repo name
- Case-insensitive matching
- Clear search button (X icon) when text is present

### 4.4 Responsive Design

**Breakpoints:**
- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

## 5. Initial Data Source

### Curated Hook List (Seed Data)

Based on research, include hooks from these prominent repositories:

1. **awesome-claude-code** (hesreallyhim)
   - Curated list of hooks, skills, commands
   - https://github.com/hesreallyhim/awesome-claude-code

2. **claude-code-showcase** (ChrisWiles)
   - Comprehensive configuration examples
   - https://github.com/ChrisWiles/claude-code-showcase

3. **claude-code-hooks-mastery** (disler)
   - Complete lifecycle hook coverage
   - https://github.com/disler/claude-code-hooks-mastery

4. **everything-claude-code** (affaan-m)
   - Production-ready configs from hackathon winner
   - https://github.com/affaan-m/everything-claude-code

5. **claudekit** (carlrannaberg)
   - Toolkit of commands, hooks, utilities
   - https://github.com/carlrannaberg/claudekit

6. **claude-hooks** (decider)
   - Clean code practices and workflow automation
   - https://github.com/decider/claude-hooks

7. **claude-hooks** (johnlindquist)
   - TypeScript-powered hook system with type safety
   - https://github.com/johnlindquist/claude-hooks

8. **my-claude-code-setup** (centminmod)
   - Starter template with memory bank system
   - https://github.com/centminmod/my-claude-code-setup

**Data Entry Method (MVP):**
- Manual curation in a JSON file (`hooks-data.json`)
- File stored in repository or public folder
- Future: Admin panel for adding/editing hooks

## 6. Technology Stack Recommendations

### Frontend Framework
- **Next.js 15+** (already in use based on hookhub/ directory)
- React 19
- TypeScript
- Tailwind CSS

### Data Storage (MVP)
- Static JSON file (`public/hooks-data.json` or `app/data/hooks.json`)
- Client-side data fetching with React hooks
- No backend/database required for MVP

### UI Components
- Use existing project structure in `hookhub/`
- Tailwind CSS for styling
- shadcn/ui components (optional, for faster development)

## 7. File Structure

```
hookhub/
├── app/
│   ├── page.tsx                 # Main page with grid view
│   ├── layout.tsx              # Root layout
│   ├── components/
│   │   ├── HookCard.tsx        # Individual hook card
│   │   ├── HookGrid.tsx        # Grid container
│   │   ├── CategoryFilter.tsx  # Category filter bar
│   │   └── SearchBar.tsx       # Search input component
│   └── data/
│       └── hooks.json          # Seed data (curated hooks)
├── public/
│   └── images/                 # Category icons (optional)
└── types/
    └── hook.ts                 # TypeScript interfaces
```

## 8. UI/UX Requirements

### Design Principles
- **Clean & Minimal:** Focus on content, not decoration
- **Fast:** Instant filtering and searching (no loading spinners)
- **Accessible:** Keyboard navigation, screen reader support
- **Consistent:** Use Geist font (already in layout.tsx)

### Color Scheme
- Use Tailwind's default palette
- Category badge colors:
  - PreToolUse: Blue (bg-blue-100, text-blue-800)
  - PostToolUse: Green (bg-green-100, text-green-800)
  - SessionStart/End: Purple (bg-purple-100, text-purple-800)
  - Workflows: Orange (bg-orange-100, text-orange-800)
  - Utilities: Gray (bg-gray-100, text-gray-800)
  - Other: Slate (bg-slate-100, text-slate-800)

### Typography
- Headings: Geist Sans (already configured)
- Body: Geist Sans
- Monospace (for code): Geist Mono

## 9. User Flows

### Primary User Flow
1. User lands on main page
2. Sees grid of all hooks (default view)
3. Can filter by category using top bar
4. Can search using search bar
5. Clicks "View on GitHub" button → Opens repo in new tab

### Secondary User Flow
1. User arrives with specific category in mind
2. Clicks category filter
3. Grid updates to show only that category
4. Finds relevant hook
5. Clicks through to GitHub

## 10. Out of Scope (Future Versions)

The following features are explicitly **not** included in the MVP:

- ❌ User authentication / accounts
- ❌ Submitting new hooks via UI
- ❌ Voting / favoriting hooks
- ❌ Comments / reviews
- ❌ Hook installation instructions
- ❌ GitHub API integration (stars, last updated)
- ❌ Hook analytics / usage tracking
- ❌ Hook dependencies / requirements display
- ❌ Code preview / syntax highlighting
- ❌ Pagination (MVP assumes < 100 hooks)
- ❌ Sorting (by stars, date, name)
- ❌ Tags beyond categories
- ❌ Related hooks recommendations
- ❌ Backend server / API
- ❌ Database

## 11. Development Phases

### Phase 1: Data & Structure (Week 1)
- [ ] Create `hooks.json` with 20+ curated hooks
- [ ] Define TypeScript interfaces
- [ ] Set up component structure

### Phase 2: Core UI (Week 1-2)
- [ ] Build HookCard component
- [ ] Build HookGrid component
- [ ] Implement responsive layout
- [ ] Style with Tailwind CSS

### Phase 3: Filtering & Search (Week 2)
- [ ] Implement CategoryFilter component
- [ ] Implement SearchBar component
- [ ] Add filtering logic
- [ ] Test on various devices

### Phase 4: Polish & Deploy (Week 3)
- [ ] Add loading states (if needed)
- [ ] Improve accessibility
- [ ] Test keyboard navigation
- [ ] Deploy to Vercel / Netlify

## 12. Success Criteria

**The MVP is successful if:**
1. ✅ Displays at least 20 hooks in a grid layout
2. ✅ Category filtering works instantly
3. ✅ Search filters results in real-time
4. ✅ Responsive on mobile, tablet, and desktop
5. ✅ All GitHub links work correctly
6. ✅ Page loads in under 2 seconds
7. ✅ Accessible (keyboard navigation works)
8. ✅ No JavaScript errors in console

## 13. Sample Hooks Data Entry

```json
{
  "hooks": [
    {
      "id": "1",
      "name": "format-typescript",
      "category": "PostToolUse",
      "description": "Automatically formats TypeScript/TSX files using Prettier after Write/Edit operations",
      "repoUrl": "https://github.com/disler/claude-code-hooks-mastery",
      "repoOwner": "disler",
      "repoName": "claude-code-hooks-mastery"
    },
    {
      "id": "2",
      "name": "activity-logger",
      "category": "PreToolUse",
      "description": "Logs all tool usage to daily log files with JSON parsing and fallback handling",
      "repoUrl": "https://github.com/ChrisWiles/claude-code-showcase",
      "repoOwner": "ChrisWiles",
      "repoName": "claude-code-showcase"
    },
    {
      "id": "3",
      "name": "git-auto-stage",
      "category": "PostToolUse",
      "description": "Automatically stages files in git after formatting completes successfully",
      "repoUrl": "https://github.com/decider/claude-hooks",
      "repoOwner": "decider",
      "repoName": "claude-hooks"
    }
  ]
}
```

## 14. References & Resources

### Claude Code Documentation
- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Model Context Protocol](https://modelcontextprotocol.io/docs)

### Open Source Hook Repositories
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - Curated list
- [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) - Configuration examples
- [claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) - Comprehensive hooks
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) - Hackathon winner collection
- [claudekit](https://github.com/carlrannaberg/claudekit) - Toolkit of utilities
- [claude-hooks (decider)](https://github.com/decider/claude-hooks) - Clean code practices
- [claude-hooks (johnlindquist)](https://github.com/johnlindquist/claude-hooks) - TypeScript system
- [my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup) - Starter template

---

**Next Steps:**
1. Review and approve this spec
2. Create hooks.json with curated data from above repositories
3. Begin Phase 1 development
4. Iterate based on feedback
