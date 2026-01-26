# HookHub

A community-driven platform for discovering and browsing open-source Claude Code hooks. HookHub helps developers find useful automation scripts for their Claude Code workflows.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## What are Claude Code Hooks?

Claude Code hooks are automation scripts that execute at specific points during Claude Code's operation lifecycle. They enable:

- Workflow automation (formatting, linting, testing)
- Policy enforcement (security checks, validation)
- External tool integration (git, notifications, logging)

Common hook types include `PreToolUse`, `PostToolUse`, `SessionStart`, `SessionEnd`, and more.

## Features

✨ **Browse 22+ Curated Hooks** - Discover hooks from top community repositories
🔍 **Real-time Search** - Filter by name, description, or repository
🏷️ **Category Filtering** - Find hooks by lifecycle event (PreToolUse, PostToolUse, etc.)
📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
🎨 **Color-coded Badges** - Quick visual identification of hook categories
🔗 **Direct GitHub Links** - Access source code with one click

## Tech Stack

- **Framework:** Next.js 16.1.4 with App Router
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Fonts:** Geist Sans & Geist Mono
- **Linting:** ESLint 9

## Project Structure

```plaintext
hookhub/
├── app/
│   ├── components/
│   │   ├── HookCard.tsx          # Individual hook card component
│   │   ├── HookGrid.tsx          # Grid container with filtering logic
│   │   ├── CategoryFilter.tsx    # Category filter bar
│   │   └── SearchBar.tsx         # Search input component
│   ├── data/
│   │   └── hooks.json            # Curated hooks seed data
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── types/
│   └── hook.ts                   # TypeScript type definitions
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository and navigate to the hookhub directory:

```bash
cd hookhub
```

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

1. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Key Components

### HookCard

Displays individual hook information with:

- Color-coded category badge
- Hook name and description
- GitHub repository link

### CategoryFilter

Horizontal filter bar with:

- "All" option (default)
- Category buttons with active state
- Instant client-side filtering

### SearchBar

Real-time search with:

- Search across name, description, and repository
- Clear button (X icon)
- Case-insensitive matching

### HookGrid

Main component that orchestrates:

- State management for filters and search
- Filtering logic with useMemo optimization
- Responsive grid layout
- Empty state handling

## Data Model

### Hook Interface

```typescript
interface Hook {
  id: string;
  name: string;
  category: HookCategory;
  description: string;
  repoUrl: string;
  repoOwner: string;
  repoName: string;
  stars?: number;        // Future feature
  lastUpdated?: string;  // Future feature
}
```

### Hook Categories

- `PreToolUse` - Execute before tool operations
- `PostToolUse` - Execute after tool operations
- `SessionStart` - Run when session starts
- `SessionEnd` - Run when session ends
- `UserPromptSubmit` - Process user prompts
- `PermissionRequest` - Handle permission requests
- `SubagentStop` - Triggered when subagent stops
- `PreCompact` - Before context compaction
- `Stop` - When Claude Code stops
- `Notification` - Custom notifications
- `Utility` - Helper scripts
- `Workflow` - Multi-hook workflows
- `Other` - Miscellaneous hooks

## Responsive Design

The layout adapts to different screen sizes:

- **Mobile** (< 640px): 1 column grid
- **Tablet** (640px - 1024px): 2 columns grid
- **Desktop** (> 1024px): 3 columns grid

## Adding New Hooks

To add new hooks to the directory:

1. Edit `app/data/hooks.json`
2. Add a new hook object following the Hook interface
3. Ensure the category matches a valid HookCategory
4. The changes will be reflected immediately in development mode

Example:

```json
{
  "id": "23",
  "name": "my-custom-hook",
  "category": "PostToolUse",
  "description": "Brief description of what this hook does",
  "repoUrl": "https://github.com/username/repo",
  "repoOwner": "username",
  "repoName": "repo"
}
```

## Future Enhancements

Planned features for future versions:

- GitHub API integration for live star counts and last update dates
- User authentication and favorites
- Submit new hooks via UI
- Voting/rating system
- Hook installation instructions
- Code preview with syntax highlighting
- Pagination for larger datasets
- Sorting options (by stars, date, name)
- Tag system beyond categories

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Model Context Protocol](https://modelcontextprotocol.io/docs)
- [Project Specification](memory/spec/CLAUDE.md)

## Featured Hook Repositories

The hooks in HookHub are curated from these excellent repositories:

- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) by hesreallyhim
- [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) by ChrisWiles
- [claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) by disler
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by affaan-m
- [claudekit](https://github.com/carlrannaberg/claudekit) by carlrannaberg
- [claude-hooks](https://github.com/decider/claude-hooks) by decider
- [claude-hooks](https://github.com/johnlindquist/claude-hooks) by johnlindquist
- [my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup) by centminmod

## License

This project is part of the Claude Code Crash Course repository.

---

Built with ❤️ for the Claude Code community
