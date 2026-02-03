import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/app/components/SearchBar';

describe('SearchBar Component', () => {
  it('renders search input', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);

    expect(screen.getByPlaceholderText(/Search hooks by name, description, or repository/i)).toBeInTheDocument();
  });

  it('displays current search query value', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="test query" onSearchChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/Search hooks/i) as HTMLInputElement;
    expect(input.value).toBe('test query');
  });

  it('calls onSearchChange when typing', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(input, 'test');

    // user-event v16+ sends individual character events
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledTimes(4);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, 't');
    expect(mockOnChange).toHaveBeenNthCalledWith(2, 'e');
    expect(mockOnChange).toHaveBeenNthCalledWith(3, 's');
    expect(mockOnChange).toHaveBeenNthCalledWith(4, 't');
  });

  it('renders search icon', () => {
    const mockOnChange = jest.fn();
    const { container } = render(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);

    // Search icon from lucide-react will be rendered as SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct input type', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/Search hooks/i);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('clears input value when empty string is passed', () => {
    const mockOnChange = jest.fn();
    const { rerender } = render(<SearchBar searchQuery="test" onSearchChange={mockOnChange} />);

    let input = screen.getByPlaceholderText(/Search hooks/i) as HTMLInputElement;
    expect(input.value).toBe('test');

    rerender(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);
    input = screen.getByPlaceholderText(/Search hooks/i) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('handles rapid typing correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/Search hooks/i);
    await user.type(input, 'rapid', { delay: 1 }); // Very fast typing

    expect(mockOnChange).toHaveBeenCalledTimes(5);
  });

  it('maintains focus after typing', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/Search hooks/i);
    await user.click(input);
    await user.type(input, 'test');

    expect(input).toHaveFocus();
  });

  it('shows clear button when there is a search query', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="test" onSearchChange={mockOnChange} />);

    const clearButton = screen.getByRole('button', { name: /Clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('hides clear button when search query is empty', () => {
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="" onSearchChange={mockOnChange} />);

    const clearButton = screen.queryByRole('button', { name: /Clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onSearchChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<SearchBar searchQuery="test" onSearchChange={mockOnChange} />);

    const clearButton = screen.getByRole('button', { name: /Clear search/i });
    await user.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });
});
