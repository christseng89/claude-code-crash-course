# HooksHub - Claude Code Hooks Registry

A beautiful, modern landing page for discovering and publishing Claude Code hooks. Built with Next.js, React, and Tailwind CSS with a cool, rainy aesthetic.

## Design Features

### 🌧️ Cool & Rainy Aesthetic

- **Dark Color Palette**: Slate blues, sky blues, and cyan accents create a cool, atmospheric feel
- **Rainy Atmosphere**:
  - Layered gradient backgrounds simulating cloudy skies
  - Soft blur effects creating depth and atmosphere
  - Semi-transparent overlays for a misty, rainy vibe
- **Modern Minimalism**: Clean lines, spacious layouts, and careful typography

### 🎨 Visual Elements

- **Gradient Effects**: Multi-layered gradients for buttons, text, and backgrounds
- **Glass Morphism**: Backdrop blur effects on navigation and cards
- **Hover States**: Interactive elements respond with smooth transitions and glows
- **Color Scheme**:
  - Primary: Cyan-400 to Sky-500 (bright, energetic)
  - Secondary: Slate-900 (dark, moody background)
  - Accents: Blue-400 (depth)

## Pages & Sections

### Navigation Bar
- Sticky header with HooksHub logo (cloud icon + gradient text)
- Quick links: Browse, Publish, Docs
- Sign In button with gradient background and glow effect

### Hero Section
- Large hero headline: "Automate Your Claude Code Workflow"
- Gradient subheading highlighting "Claude Code"
- Compelling call-to-action buttons
- Key stats: 200+ Hooks, 15K+ Community Users, 98% Uptime

### Browse by Category
- Grid of category cards (Git Automation, Security, Formatting, Testing, Monitoring, Notifications)
- Hover effects with cyan border highlights
- Hook count per category

### Featured Hooks
- 3-column grid of hook cards
- Each card displays:
  - Icon/emoji
  - Hook name and description
  - Category badge
  - Download count
  - "View" link
- Smooth gradient hover transitions with border glow

### Featured Hooks
1. **Auto Commit** 🔀 - Generate intelligent commit messages
2. **Security Review** 🔒 - Code vulnerability scanning
3. **Code Formatter** ✨ - Auto-format with Prettier & ESLint
4. **Activity Logger** 📝 - Tool usage audit trails
5. **Pre-commit Validator** ✅ - Change validation before commits
6. **Notification Handler** 🔔 - Real-time event notifications

### Publish Section
- Call-to-action card encouraging users to share hooks
- Large, prominent "Publish Your Hook" button
- Gradient card background with cyan border

### Footer
- Multi-column layout: About, Product, Community, Legal
- Brand identity maintained
- Copyright notice

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Styling**: Tailwind CSS 4.0
- **Icons**: lucide-react
- **Language**: TypeScript
- **React Version**: 19.2.3

## Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The site will be available at `http://localhost:3000`

## Customization

### Colors
Edit the Tailwind color classes in `page.tsx`:
- `bg-gradient-to-br from-slate-900` - Main background
- `from-cyan-400 to-sky-400` - Accent colors
- `text-slate-400` - Text colors

### Content
Modify the `hooks` and `categories` arrays at the top of `page.tsx`:

```typescript
const hooks = [
  {
    name: "Hook Name",
    description: "Hook description",
    category: "Category Name",
    icon: "🔀",
    downloads: 1000,
  },
  // Add more hooks...
];
```

### Metadata
Update layout.tsx for SEO:
```typescript
export const metadata: Metadata = {
  title: "HooksHub - Claude Code Hooks Registry",
  description: "Your custom description",
};
```

## Claude Code Style

This landing page reflects Claude Code design principles:
- **Minimal yet powerful**: Clean interface focused on functionality
- **Developer-first**: Fast, responsive, no bloat
- **Modern aesthetics**: Gradient accents, subtle animations
- **Community-focused**: Emphasizes collaboration and sharing

## Features

✅ Fully responsive design (mobile, tablet, desktop)
✅ Smooth hover animations and transitions
✅ Accessibility-friendly semantic HTML
✅ Production-ready optimized build
✅ Type-safe React components
✅ SEO optimized metadata
✅ No external dependencies beyond Next.js and Tailwind

## Future Enhancements

- [ ] Hook search and filtering
- [ ] User authentication system
- [ ] Hook upload/publishing workflow
- [ ] Hook rating system
- [ ] User profiles and dashboards
- [ ] API documentation
- [ ] Real-time hook updates
- [ ] Dark/Light theme toggle

---

**Built for the Claude Code community** ☁️
