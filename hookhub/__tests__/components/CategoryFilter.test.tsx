import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from '@/app/components/CategoryFilter';

const mockCategories = ['All', 'PreToolUse', 'PostToolUse', 'Workflow', 'Utility'];

describe('CategoryFilter Component', () => {
  it('renders all category buttons', () => {
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelect}
      />
    );

    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('highlights selected category with gradient', () => {
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="PreToolUse"
        onSelectCategory={mockOnSelect}
      />
    );

    const selectedButton = screen.getByText('PreToolUse');
    expect(selectedButton).toHaveClass('bg-gradient-to-r');
    expect(selectedButton).toHaveClass('from-blue-600');
    expect(selectedButton).toHaveClass('to-purple-600');
  });

  it('calls onSelectCategory when a category is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelect}
      />
    );

    const postToolUseButton = screen.getByText('PostToolUse');
    await user.click(postToolUseButton);

    expect(mockOnSelect).toHaveBeenCalledWith('PostToolUse');
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('applies different styles to selected vs unselected categories', () => {
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="PreToolUse"
        onSelectCategory={mockOnSelect}
      />
    );

    const selectedButton = screen.getByText('PreToolUse');
    const unselectedButton = screen.getByText('PostToolUse');

    expect(selectedButton).toHaveClass('bg-gradient-to-r');
    expect(selectedButton).toHaveClass('text-white');
    expect(unselectedButton).toHaveClass('bg-white/80');
    expect(unselectedButton).toHaveClass('text-gray-700');
  });

  it('renders buttons in correct order', () => {
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelect}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('All');
    expect(buttons[1]).toHaveTextContent('PreToolUse');
    expect(buttons[2]).toHaveTextContent('PostToolUse');
    expect(buttons[3]).toHaveTextContent('Workflow');
    expect(buttons[4]).toHaveTextContent('Utility');
  });

  it('handles empty categories array', () => {
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={[]}
        selectedCategory="All"
        onSelectCategory={mockOnSelect}
      />
    );

    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  it('allows switching between categories', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();
    const { rerender } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelect}
      />
    );

    // Click PreToolUse
    await user.click(screen.getByText('PreToolUse'));
    expect(mockOnSelect).toHaveBeenCalledWith('PreToolUse');

    // Update props to reflect new selection
    rerender(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="PreToolUse"
        onSelectCategory={mockOnSelect}
      />
    );

    // Click PostToolUse
    await user.click(screen.getByText('PostToolUse'));
    expect(mockOnSelect).toHaveBeenCalledWith('PostToolUse');
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });

  it('renders as a div container with flex layout', () => {
    const mockOnSelect = jest.fn();
    const { container } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelect}
      />
    );

    const wrapper = container.querySelector('div');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('flex-wrap');
  });

  it('unselected buttons have hover effects', () => {
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={mockOnSelect}
      />
    );

    const button = screen.getByText('PostToolUse');
    expect(button).toHaveClass('hover:bg-gray-50');
    expect(button).toHaveClass('hover:ring-gray-300/50');
  });

  it('selected button maintains gradient and shadow', () => {
    const mockOnSelect = jest.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory="Workflow"
        onSelectCategory={mockOnSelect}
      />
    );

    const selectedButton = screen.getByText('Workflow');
    expect(selectedButton).toHaveClass('bg-gradient-to-r');
    expect(selectedButton).toHaveClass('shadow-lg');
    expect(selectedButton).toHaveClass('shadow-blue-500/30');
  });
});
