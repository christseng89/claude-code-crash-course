# Hero Component Specification

**Version:** 1.0.0
**Last Updated:** 2026-02-05
**Component Location:** `app/components/heros/`

## Overview

The Hero component serves as the primary header/navigation bar for the HookHub application. It provides brand identity, navigation context, and theme controls while maintaining a clean, modern aesthetic that aligns with the overall application design.

## Purpose and Goals

### Primary Goals
1. **Brand Identity** - Establish immediate visual recognition with the HookHub logo, icon, and tagline
2. **Navigation Context** - Provide users with clear understanding of where they are in the application
3. **Utility Access** - Offer quick access to theme toggle and future navigation/utility controls
4. **Visual Hierarchy** - Create a clear separation between the header and main content area
5. **Responsive Design** - Maintain usability and visual appeal across all device sizes

### Secondary Goals
- Support multiple hero variations (minimal, expanded, with navigation, with CTA buttons, etc.)
- Maintain consistent styling with the application's design system
- Provide excellent accessibility for all users
- Support smooth theme transitions (light/dark mode)

## Core Requirements

### Must Have
- Application logo/icon (Webhook icon with gradient background)
- Application name (HookHub) with gradient text treatment
- Tagline/description ("Discover Claude Code hooks")
- Theme toggle integration
- Responsive layout that works on mobile, tablet, and desktop
- Dark mode support with appropriate color transitions
- Semantic HTML structure (`<header>` element)
- Backdrop blur effect for visual depth

### Should Have
- Smooth transitions between light and dark themes
- Proper spacing and padding that matches application design system
- Support for additional navigation items or CTAs in variations
- Keyboard navigation support
- ARIA labels for accessibility

### Nice to Have
- Animation on initial load
- Sticky/fixed positioning option for variations
- Search bar integration for certain variations
- User profile/avatar integration for authenticated variations

## Visual Design Specifications

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ [Icon] [Title]                              [Theme Toggle]  │
│        [Tagline]                                             │
└─────────────────────────────────────────────────────────────┐
```

### Dimensions
- **Max Width:** 1280px (7xl container - `max-w-7xl`)
- **Horizontal Padding:**
  - Mobile: 16px (`px-4`)
  - Tablet: 24px (`sm:px-6`)
  - Desktop: 32px (`lg:px-8`)
- **Vertical Padding:** 24px (`py-6`)
- **Icon Container:** 40px × 40px (with 10px padding)
- **Icon Size:** 24px × 24px (`h-6 w-6`)
- **Gap Between Elements:** 12px (`gap-3`)

### Colors

#### Light Mode
- **Background:** White with 80% opacity (`bg-white/80`)
- **Border:** Gray-200 with 50% opacity (`border-gray-200/50`)
- **Title Gradient:** Gray-900 to Gray-600 (`from-gray-900 to-gray-600`)
- **Tagline:** Gray-600 (`text-gray-600`)
- **Icon Background Gradient:** Blue-500 to Purple-600 (`from-blue-500 to-purple-600`)
- **Icon Color:** White (`text-white`)

#### Dark Mode
- **Background:** Gray-900 with 80% opacity (`dark:bg-gray-900/80`)
- **Border:** Gray-800 with 50% opacity (`dark:border-gray-800/50`)
- **Title Gradient:** White to Gray-400 (`dark:from-white dark:to-gray-400`)
- **Tagline:** Gray-400 (`dark:text-gray-400`)
- **Icon Background:** Same as light mode (consistent brand color)

### Typography
- **Title (H1):**
  - Font Size: 30px (`text-3xl`)
  - Font Weight: Bold (`font-bold`)
  - Letter Spacing: Tight (`tracking-tight`)
  - Style: Gradient text with background clipping
- **Tagline:**
  - Font Size: 14px (`text-sm`)
  - Font Weight: Regular (default)

### Effects
- **Backdrop Blur:** Large (`backdrop-blur-lg`)
- **Border:** Bottom border only (`border-b`)
- **Icon Container Border Radius:** 12px (`rounded-xl`)
- **Gradient Direction:**
  - Icon: Bottom-right diagonal (`bg-gradient-to-br`)
  - Title: Left to right (`bg-gradient-to-r`)

## Component Structure

### Semantic HTML
```tsx
<header>              // Semantic header element
  <div>               // Container (max-width + padding)
    <div>             // Flex container (justify-between)
      <div>           // Left group (logo + text)
        <div>         // Icon container
          <Icon />    // Lucide icon
        </div>
        <div>         // Text container
          <h1 />      // Application name
          <p />       // Tagline
        </div>
      </div>
      <ThemeToggle /> // Right utility
    </div>
  </div>
</header>
```

### Component Organization
- Use functional components (not class components)
- Export as default
- Keep components under 100 lines when possible
- Extract complex logic into custom hooks if needed

## Styling Guidelines

### Tailwind CSS Conventions
- **Use Tailwind exclusively** - No custom CSS or CSS-in-JS
- **Mobile-first responsive design** - Base styles are mobile, use `sm:`, `md:`, `lg:`, `xl:` prefixes for larger screens
- **Dark mode classes** - Use `dark:` prefix for all dark mode styles
- **Opacity with slash notation** - Use `/80`, `/50` for transparency (e.g., `bg-white/80`)
- **Consistent spacing scale** - Use Tailwind's spacing scale (px-4, py-6, gap-3, etc.)

### Color System
- Maintain the blue-500 to purple-600 gradient for icon backgrounds (brand identity)
- Use gray scale for text and backgrounds (50-950 range)
- Ensure WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)

## Responsive Behavior

### Breakpoints
- **Mobile (< 640px):**
  - Stack elements vertically if needed
  - Reduce padding to `px-4`
  - Consider smaller icon size for very small screens

- **Tablet (640px - 1024px):**
  - Increase padding to `sm:px-6`
  - Maintain horizontal layout

- **Desktop (≥ 1024px):**
  - Full padding `lg:px-8`
  - Maximum width constraint applied

### Element Behavior
- Logo and title should never wrap
- Tagline can wrap on very small screens if needed
- Theme toggle should remain accessible and visible at all sizes
- Maintain touch-friendly tap targets (minimum 44px × 44px)

## Dark Mode Support

### Requirements
- All color values must have dark mode equivalents
- Transitions between themes should be smooth
- Maintain visual hierarchy in both modes
- Ensure sufficient contrast in both modes
- Test with system preference changes

### Implementation
- Use Tailwind's `dark:` prefix for all theme-specific styles
- Rely on parent theme provider (next-themes)
- No JavaScript theme logic in Hero component itself

## Accessibility Requirements

### Semantic HTML
- Use `<header>` for the hero container
- Use `<h1>` for the main title (only one H1 per page)
- Use `<p>` for the tagline

### ARIA and Screen Readers
- Ensure ThemeToggle has proper ARIA labels
- Consider adding `aria-label` to icon container if it's interactive
- Maintain logical tab order (logo → navigation → theme toggle)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators on all focusable elements
- Skip to content link for screen reader users (consider for variations)

### Color and Contrast
- Maintain WCAG 2.1 AA contrast ratios
- Don't rely solely on color to convey information
- Test with color blindness simulators

## Variation Guidelines

### Creating New Hero Variations

When implementing different hero variations, consider these patterns:

#### 1. **Hero Minimal** (Current Implementation)
- Logo + Title + Tagline + Theme Toggle
- No navigation or additional elements
- Cleanest, most focused version

#### 2. **Hero with Navigation**
- Add horizontal navigation menu between logo and theme toggle
- Use `<nav>` element with proper ARIA
- Maintain responsive collapse for mobile (hamburger menu)

#### 3. **Hero with CTA**
- Add primary CTA button (e.g., "Submit Hook", "Sign In")
- Place CTA next to theme toggle or replace tagline
- Use contrasting color for CTA button

#### 4. **Hero with Search**
- Integrate search bar in the hero
- Could replace tagline or appear below it
- Mobile: full-width, Desktop: inline

#### 5. **Hero Expanded**
- Larger vertical padding
- Bigger typography
- Additional descriptive text
- Potential background image or pattern

#### 6. **Hero Sticky**
- Fixed positioning as user scrolls
- Reduce padding/height when scrolled
- Add shadow on scroll for depth

### Props Interface for Variations

Future hero variations should support these props:

```typescript
interface HeroProps {
  // Content
  title?: string;
  tagline?: string;
  icon?: React.ComponentType<{ className?: string }>;

  // Layout
  variant?: 'minimal' | 'navigation' | 'cta' | 'search' | 'expanded';
  sticky?: boolean;

  // Navigation (for navigation variant)
  navItems?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;

  // CTA (for cta variant)
  ctaLabel?: string;
  ctaAction?: () => void;
  ctaHref?: string;

  // Styling
  className?: string;
  showThemeToggle?: boolean;

  // Behavior
  onSearch?: (query: string) => void;
}
```

### Variation Checklist
When creating a new variation, ensure:
- [ ] Maintains core brand identity (logo, colors, typography)
- [ ] Responsive across all breakpoints
- [ ] Dark mode support included
- [ ] Accessibility requirements met
- [ ] Performance optimized (no unnecessary re-renders)
- [ ] Documented in this spec file
- [ ] TypeScript types defined
- [ ] Example usage provided

## Usage Examples

### Current Implementation (Hero Minimal)
```tsx
import Hero from "./components/heros/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      {/* Main content */}
    </div>
  );
}
```

### Future: Hero with Navigation
```tsx
import HeroWithNav from "./components/heros/HeroWithNav";

const navItems = [
  { label: "Browse", href: "/browse", active: true },
  { label: "Submit", href: "/submit" },
  { label: "Docs", href: "/docs" },
];

export default function Home() {
  return (
    <div>
      <HeroWithNav navItems={navItems} />
      {/* Main content */}
    </div>
  );
}
```

### Future: Hero with CTA
```tsx
import HeroWithCTA from "./components/heros/HeroWithCTA";

export default function Home() {
  return (
    <div>
      <HeroWithCTA
        ctaLabel="Submit Hook"
        ctaHref="/submit"
      />
      {/* Main content */}
    </div>
  );
}
```

## Testing Requirements

### Visual Testing
- Test on mobile (375px), tablet (768px), and desktop (1440px) viewports
- Test with light and dark themes
- Test with different zoom levels (100%, 125%, 150%)
- Test with browser DevTools device emulation

### Functional Testing
- Theme toggle works correctly
- Navigation items are clickable and route properly (for navigation variant)
- CTA buttons trigger correct actions (for CTA variant)
- Search input accepts text and triggers search (for search variant)

### Accessibility Testing
- Screen reader announces all content correctly
- Keyboard navigation works smoothly
- Focus indicators are visible
- Color contrast meets WCAG 2.1 AA standards
- Test with NVDA, JAWS, or VoiceOver

### Performance Testing
- Component renders without layout shifts
- No unnecessary re-renders on parent state changes
- Images/icons load quickly (Lucide icons are SVG - no network request)

## Design System Integration

### Alignment with HookHub Design
The hero component should align with:
- **Overall gradient background:** Blue-50 to Purple-50 (light), Blue-950 to Purple-950 (dark)
- **Card components:** Similar backdrop blur and transparency effects
- **Typography:** Consistent with Geist Sans font family
- **Spacing:** Max-width of 7xl (1280px) matches other content containers
- **Color palette:** Blue and purple gradients for brand elements, gray scale for text

### Consistency Guidelines
- Use the same padding system as other components (`px-4 sm:px-6 lg:px-8`)
- Match border styling (50% opacity, appropriate color)
- Use consistent icon sizes (h-6 w-6 for standard icons)
- Maintain same backdrop blur intensity (`backdrop-blur-lg`)

## File Naming and Organization

### File Structure
```
app/components/heros/
├── Hero.tsx                    // Current minimal hero
├── HeroWithNav.tsx            // Future: with navigation
├── HeroWithCTA.tsx            // Future: with CTA button
├── HeroWithSearch.tsx         // Future: with search
├── HeroExpanded.tsx           // Future: expanded version
├── HeroSticky.tsx             // Future: sticky version
└── types.ts                   // Shared TypeScript interfaces
```

### Naming Conventions
- Component files: PascalCase with `.tsx` extension
- Exported components: Default exports with matching names
- Props interfaces: `<ComponentName>Props`
- Variations: Descriptive suffix (e.g., `HeroWithNav`, `HeroExpanded`)

## Performance Considerations

### Optimization Guidelines
- Use React.memo() if hero receives frequently changing props
- Avoid inline functions in JSX (extract to component level)
- Use CSS transitions instead of JavaScript animations
- Lazy load icons if bundle size becomes an issue (unlikely with Lucide)
- Minimize re-renders by keeping hero stateless when possible

### Bundle Size
- Current implementation: Minimal (uses only Lucide icon and ThemeToggle)
- Keep variations small by avoiding heavy dependencies
- Consider code splitting for complex variations

## Future Enhancements

### Potential Features
1. **Animated Logo** - Subtle animation on page load
2. **Breadcrumb Integration** - Show navigation path in hero
3. **User Profile** - Display user avatar and name when authenticated
4. **Notification Badge** - Show unread notifications count
5. **Quick Actions Menu** - Dropdown with common actions
6. **Progress Indicator** - Show loading state for async operations
7. **Announcement Banner** - Temporary promotional or alert banner above hero

### Considerations for Enhancement
- Maintain performance and simplicity
- Don't overcrowd the header
- Ensure mobile usability remains excellent
- Keep accessibility at forefront of any changes

## Version History

### Version 1.0.0 (2026-02-05)
- Initial specification based on current Hero component implementation
- Defined core requirements and design specifications
- Outlined variation guidelines and future enhancements
- Established accessibility and responsive design requirements

---

**Note:** This specification is a living document. Update it when creating new hero variations or making significant changes to the design system.
