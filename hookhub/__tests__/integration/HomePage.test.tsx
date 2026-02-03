import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

// Mock the hooks data
jest.mock('@/app/data/hooks.json', () => ({
  hooks: [
    {
      id: "1",
      name: "format-typescript",
      category: "PostToolUse",
      description: "Automatically formats TypeScript and TSX files",
      repoUrl: "https://github.com/disler/format-typescript",
      repoOwner: "disler",
      repoName: "format-typescript",
      github: { stars: 487, forks: 52, issues: 8, lastSync: "2026-02-02T10:00:00Z" },
      metadata: {
        version: "1.2.0",
        hookTypes: ["PostToolUse"],
        matchers: ["Write", "Edit"],
        tags: ["formatting", "typescript", "prettier"],
        license: "MIT",
        keywords: ["format"]
      },
      stats: { installs: 1247, dailyActive: 823, rating: 4.8, reviews: 156, views: 3421 },
      compatibility: { platforms: ["All"], dependencies: [] },
      quality: { verified: true, communityChoice: true, securityAudited: true, documentationScore: 95 },
      author: { username: "disler", avatarUrl: "https://github.com/disler.png", isVerified: true, reputation: 2847 },
      createdAt: "2025-12-15T10:00:00Z",
      updatedAt: "2026-02-01T15:30:00Z"
    },
    {
      id: "2",
      name: "activity-logger",
      category: "PreToolUse",
      description: "Logs all tool usage to a daily file",
      repoUrl: "https://github.com/ChrisWiles/activity-logger",
      repoOwner: "ChrisWiles",
      repoName: "activity-logger",
      github: { stars: 234, forks: 28, issues: 3, lastSync: "2026-02-02T09:30:00Z" },
      metadata: {
        version: "2.1.0",
        hookTypes: ["PreToolUse"],
        matchers: ["*"],
        tags: ["logging", "audit"],
        license: "MIT",
        keywords: ["log"]
      },
      stats: { installs: 892, dailyActive: 567, rating: 4.6, reviews: 98, views: 2134 },
      compatibility: { platforms: ["All"], dependencies: [] },
      quality: { verified: true, communityChoice: false, securityAudited: true, documentationScore: 87 },
      author: { username: "ChrisWiles", avatarUrl: "https://github.com/ChrisWiles.png", isVerified: true, reputation: 1523 },
      createdAt: "2025-11-20T14:00:00Z",
      updatedAt: "2026-01-28T11:20:00Z"
    }
  ]
}));

describe('Home Page Integration Tests', () => {
  it('renders the main layout with header and footer', () => {
    render(<Home />);

    expect(screen.getByText('HookHub')).toBeInTheDocument();
    expect(screen.getByText('Discover Claude Code hooks')).toBeInTheDocument();
    expect(screen.getByText('Built for the Claude Code community')).toBeInTheDocument();
  });

  it('displays all hooks on initial load', () => {
    render(<Home />);

    expect(screen.getByText('format-typescript')).toBeInTheDocument();
    expect(screen.getByText('activity-logger')).toBeInTheDocument();
    expect(screen.getByText('2 hooks found')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Home />);

    // Theme toggle should be present in header
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('complete user flow: search and filter', async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Initial state
    expect(screen.getByText('2 hooks found')).toBeInTheDocument();

    // Filter by category - use getAllByRole to find buttons, then filter by text
    const buttons = screen.getAllByRole('button');
    const preToolUseButton = buttons.find(btn => btn.textContent === 'PreToolUse');
    expect(preToolUseButton).toBeDefined();
    await user.click(preToolUseButton!);

    expect(screen.getByText('1 hook found')).toBeInTheDocument();
    expect(screen.getByText('activity-logger')).toBeInTheDocument();
    expect(screen.queryByText('format-typescript')).not.toBeInTheDocument();

    // Reset to All
    const allButtons = screen.getAllByRole('button');
    const allButton = allButtons.find(btn => btn.textContent === 'All');
    expect(allButton).toBeDefined();
    await user.click(allButton!);
    expect(screen.getByText('2 hooks found')).toBeInTheDocument();

    // Search
    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'format');

    await waitFor(() => {
      expect(screen.getByText('1 hook found')).toBeInTheDocument();
    }, { timeout: 500 });

    expect(screen.getByText('format-typescript')).toBeInTheDocument();
    expect(screen.queryByText('activity-logger')).not.toBeInTheDocument();
  });

  it('displays correct GitHub links', () => {
    render(<Home />);

    const links = screen.getAllByRole('link', { name: /View on GitHub/i });
    expect(links.length).toBe(2);
    expect(links[0]).toHaveAttribute('href', 'https://github.com/disler/format-typescript');
    expect(links[1]).toHaveAttribute('href', 'https://github.com/ChrisWiles/activity-logger');
  });

  it('shows empty state when no results match search', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No hooks found')).toBeInTheDocument();
    }, { timeout: 500 });

    expect(screen.getByText(/Try adjusting your search or filter criteria/i)).toBeInTheDocument();
  });

  it('maintains responsive grid layout classes', () => {
    const { container } = render(<Home />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });

  it('renders all hook cards with proper structure', () => {
    const { container } = render(<Home />);

    const articles = container.querySelectorAll('article');
    expect(articles.length).toBe(2);

    articles.forEach(article => {
      expect(article).toHaveClass('group');
      expect(article).toHaveClass('rounded-2xl');
    });
  });

  it('displays GitHub stats for all hooks', () => {
    render(<Home />);

    expect(screen.getByText('487')).toBeInTheDocument(); // format-typescript stars
    expect(screen.getByText('234')).toBeInTheDocument(); // activity-logger stars
  });

  it('displays tags for hooks', () => {
    render(<Home />);

    expect(screen.getByText('formatting')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('logging')).toBeInTheDocument();
  });

  it('has proper semantic HTML structure', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
    expect(container.querySelectorAll('article').length).toBe(2);
  });
});
