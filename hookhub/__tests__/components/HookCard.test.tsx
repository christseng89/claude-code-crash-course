import { render, screen } from '@testing-library/react';
import HookCard from '@/app/components/HookCard';
import { mockHook, mockHook2 } from '../utils/mockData.mock';

describe('HookCard Component', () => {
  it('renders hook name correctly', () => {
    render(<HookCard hook={mockHook} />);
    expect(screen.getByText('format-typescript')).toBeInTheDocument();
  });

  it('renders hook description', () => {
    render(<HookCard hook={mockHook} />);
    expect(screen.getByText(/Automatically formats TypeScript/)).toBeInTheDocument();
  });

  it('displays category badge with correct text', () => {
    render(<HookCard hook={mockHook} />);
    expect(screen.getByText('PostToolUse')).toBeInTheDocument();
  });

  it('shows GitHub stats when available', () => {
    render(<HookCard hook={mockHook} />);
    expect(screen.getByText('487')).toBeInTheDocument(); // stars
    expect(screen.getByText('52')).toBeInTheDocument(); // forks
  });

  it('renders tags when metadata.tags exists', () => {
    render(<HookCard hook={mockHook} />);
    expect(screen.getByText('formatting')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('prettier')).toBeInTheDocument();
  });

  it('limits displayed tags to 3', () => {
    render(<HookCard hook={mockHook} />);
    // Check that only first 3 tags are displayed (formatting, typescript, prettier)
    // The 4th tag (code-quality) should not be displayed
    expect(screen.getByText('formatting')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('prettier')).toBeInTheDocument();
    // Only 3 tags should be visible in the tag container
    const tagElements = screen.getAllByText(/^(formatting|typescript|prettier|code-quality)$/);
    expect(tagElements.length).toBe(3);
  });

  it('renders GitHub link with correct href', () => {
    render(<HookCard hook={mockHook} />);
    const link = screen.getByRole('link', { name: /View on GitHub/i });
    expect(link).toHaveAttribute('href', 'https://github.com/disler/format-typescript');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies correct category color class for PostToolUse', () => {
    const { container } = render(<HookCard hook={mockHook} />);
    const categoryBadge = screen.getByText('PostToolUse');
    expect(categoryBadge).toHaveClass('text-green-700');
  });

  it('applies correct category color class for PreToolUse', () => {
    const { container } = render(<HookCard hook={mockHook2} />);
    const categoryBadge = screen.getByText('PreToolUse');
    expect(categoryBadge).toHaveClass('text-blue-700');
  });

  it('renders as an article element', () => {
    const { container } = render(<HookCard hook={mockHook} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('handles hooks without tags gracefully', () => {
    const hookWithoutTags = {
      ...mockHook,
      metadata: {
        ...mockHook.metadata,
        tags: []
      }
    };
    render(<HookCard hook={hookWithoutTags} />);
    expect(screen.queryByText('formatting')).not.toBeInTheDocument();
  });

  it('applies hover effect classes', () => {
    const { container } = render(<HookCard hook={mockHook} />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('hover:scale-[1.02]');
    expect(article).toHaveClass('hover:shadow-xl');
  });
});
