import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HookGrid from '@/app/components/HookGrid';
import { mockHooks } from '../utils/mockData.mock';

describe('HookGrid Component', () => {
  it('renders all hooks initially', () => {
    render(<HookGrid hooks={mockHooks} />);
    expect(screen.getByText('format-typescript')).toBeInTheDocument();
    expect(screen.getByText('activity-logger')).toBeInTheDocument();
    expect(screen.getByText('git-commit-lint')).toBeInTheDocument();
  });

  it('displays correct results count', () => {
    render(<HookGrid hooks={mockHooks} />);
    expect(screen.getByText('3 hooks found')).toBeInTheDocument();
  });

  it('displays singular "hook" when count is 1', () => {
    render(<HookGrid hooks={[mockHooks[0]]} />);
    expect(screen.getByText('1 hook found')).toBeInTheDocument();
  });

  it('extracts and displays unique categories', () => {
    render(<HookGrid hooks={mockHooks} />);
    // Check category filter buttons exist (not the hook card badges)
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map(btn => btn.textContent);
    expect(buttonTexts).toContain('All');
    expect(buttonTexts).toContain('PostToolUse');
    expect(buttonTexts).toContain('PreToolUse');
    expect(buttonTexts).toContain('Workflow');
  });

  it('filters hooks by category when category is selected', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    // Find the PostToolUse button in the category filter
    const buttons = screen.getAllByRole('button');
    const postToolUseButton = buttons.find(btn => btn.textContent === 'PostToolUse');
    expect(postToolUseButton).toBeDefined();
    await user.click(postToolUseButton!);

    expect(screen.getByText('format-typescript')).toBeInTheDocument();
    expect(screen.queryByText('activity-logger')).not.toBeInTheDocument();
    expect(screen.queryByText('git-commit-lint')).not.toBeInTheDocument();
    expect(screen.getByText('1 hook found')).toBeInTheDocument();
  });

  it('filters hooks by search query in name', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'format');

    expect(screen.getByText('format-typescript')).toBeInTheDocument();
    expect(screen.queryByText('activity-logger')).not.toBeInTheDocument();
    expect(screen.queryByText('git-commit-lint')).not.toBeInTheDocument();
  });

  it('filters hooks by search query in description', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'validates');

    expect(screen.getByText('git-commit-lint')).toBeInTheDocument();
    expect(screen.queryByText('format-typescript')).not.toBeInTheDocument();
    expect(screen.queryByText('activity-logger')).not.toBeInTheDocument();
  });

  it('filters hooks by repo owner', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'disler');

    expect(screen.getByText('format-typescript')).toBeInTheDocument();
    expect(screen.queryByText('activity-logger')).not.toBeInTheDocument();
  });

  it('combines category and search filters', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    // Select PreToolUse category
    const buttons = screen.getAllByRole('button');
    const preToolUseButton = buttons.find(btn => btn.textContent === 'PreToolUse');
    expect(preToolUseButton).toBeDefined();
    await user.click(preToolUseButton!);

    // Type search query
    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'activity');

    expect(screen.getByText('activity-logger')).toBeInTheDocument();
    expect(screen.queryByText('format-typescript')).not.toBeInTheDocument();
    expect(screen.queryByText('git-commit-lint')).not.toBeInTheDocument();
    expect(screen.getByText('1 hook found')).toBeInTheDocument();
  });

  it('shows "No hooks found" message when no results', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'nonexistent-hook');

    expect(screen.getByText('No hooks found')).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your search or filter criteria/i)).toBeInTheDocument();
  });

  it('resets to all hooks when "All" category is selected', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    // First filter by category
    let buttons = screen.getAllByRole('button');
    const postToolUseButton = buttons.find(btn => btn.textContent === 'PostToolUse');
    expect(postToolUseButton).toBeDefined();
    await user.click(postToolUseButton!);
    expect(screen.getByText('1 hook found')).toBeInTheDocument();

    // Then select "All"
    buttons = screen.getAllByRole('button');
    const allButton = buttons.find(btn => btn.textContent === 'All');
    expect(allButton).toBeDefined();
    await user.click(allButton!);
    expect(screen.getByText('3 hooks found')).toBeInTheDocument();
  });

  it('clears search results when search input is cleared', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    const searchInput = screen.getByPlaceholderText(/Search hooks/i);

    // Type search query
    await user.type(searchInput, 'format');
    expect(screen.getByText('1 hook found')).toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);
    expect(screen.getByText('3 hooks found')).toBeInTheDocument();
  });

  it('renders SearchBar component', () => {
    render(<HookGrid hooks={mockHooks} />);
    expect(screen.getByPlaceholderText(/Search hooks/i)).toBeInTheDocument();
  });

  it('renders CategoryFilter component', () => {
    render(<HookGrid hooks={mockHooks} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders HookCard for each filtered hook', () => {
    const { container } = render(<HookGrid hooks={mockHooks} />);
    const articles = container.querySelectorAll('article');
    expect(articles.length).toBe(3);
  });

  it('handles empty hooks array gracefully', () => {
    render(<HookGrid hooks={[]} />);
    expect(screen.getByText('No hooks found')).toBeInTheDocument();
  });

  it('search is case-insensitive', async () => {
    const user = userEvent.setup();
    render(<HookGrid hooks={mockHooks} />);

    const searchInput = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(searchInput, 'FORMAT');

    expect(screen.getByText('format-typescript')).toBeInTheDocument();
  });
});
