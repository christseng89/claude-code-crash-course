import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/app/components/ThemeToggle';

// Mock next-themes
const mockSetTheme = jest.fn();
let mockTheme = 'light';

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = 'light';
  });

  describe('Hydration and SSR', () => {
    it('renders after mounting (useLayoutEffect)', async () => {
      render(<ThemeToggle />);

      // Component should be mounted and visible
      // Note: In Jest, useLayoutEffect runs synchronously, so we use waitFor for consistency
      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
        expect(screen.getByLabelText('System theme')).toBeInTheDocument();
      });
    });

    it('handles the mounted state correctly', async () => {
      const { container } = render(<ThemeToggle />);

      // After mounting, the component should be visible
      await waitFor(() => {
        expect(container.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering', () => {
    it('renders all three theme buttons after mounting', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
        expect(screen.getByLabelText('System theme')).toBeInTheDocument();
      });
    });

    it('renders Sun icon for light mode button', async () => {
      const { container } = render(<ThemeToggle />);

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        const sunIcon = lightButton.querySelector('svg');
        expect(sunIcon).toBeInTheDocument();
        expect(sunIcon).toHaveClass('h-4', 'w-4');
      });
    });

    it('renders Moon icon for dark mode button', async () => {
      const { container } = render(<ThemeToggle />);

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        const moonIcon = darkButton.querySelector('svg');
        expect(moonIcon).toBeInTheDocument();
        expect(moonIcon).toHaveClass('h-4', 'w-4');
      });
    });

    it('renders Monitor icon for system theme button', async () => {
      const { container } = render(<ThemeToggle />);

      await waitFor(() => {
        const systemButton = screen.getByLabelText('System theme');
        const monitorIcon = systemButton.querySelector('svg');
        expect(monitorIcon).toBeInTheDocument();
        expect(monitorIcon).toHaveClass('h-4', 'w-4');
      });
    });

    it('renders container with flex layout and Anthropic colors', async () => {
      const { container } = render(<ThemeToggle />);

      await waitFor(() => {
        const wrapper = container.querySelector('div');
        expect(wrapper).toHaveClass('flex', 'items-center', 'gap-1', 'rounded-full');
        expect(wrapper).toHaveClass('bg-[#e8e6dc]');
        expect(wrapper).toHaveClass('dark:bg-[#141413]');
      });
    });
  });

  describe('Theme States - Light Mode', () => {
    beforeEach(() => {
      mockTheme = 'light';
    });

    it('highlights light button when theme is light', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        expect(lightButton).toHaveClass('bg-[#faf9f5]', 'text-[#d97757]', 'shadow-sm');
      });
    });

    it('does not highlight dark button when theme is light', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        expect(darkButton).toHaveClass('text-[#b0aea5]');
        expect(darkButton).not.toHaveClass('bg-[#141413]');
      });
    });

    it('does not highlight system button when theme is light', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const systemButton = screen.getByLabelText('System theme');
        expect(systemButton).toHaveClass('text-[#b0aea5]');
        expect(systemButton).not.toHaveClass('bg-[#faf9f5]');
      });
    });
  });

  describe('Theme States - Dark Mode', () => {
    beforeEach(() => {
      mockTheme = 'dark';
    });

    it('highlights dark button when theme is dark', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        expect(darkButton).toHaveClass('bg-[#141413]', 'text-[#6a9bcc]', 'shadow-sm');
      });
    });

    it('does not highlight light button when theme is dark', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        expect(lightButton).toHaveClass('text-[#b0aea5]');
        expect(lightButton).not.toHaveClass('bg-[#faf9f5]');
      });
    });

    it('does not highlight system button when theme is dark', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const systemButton = screen.getByLabelText('System theme');
        expect(systemButton).toHaveClass('text-[#b0aea5]');
        expect(systemButton).not.toHaveClass('text-[#788c5d]');
      });
    });
  });

  describe('Theme States - System Mode', () => {
    beforeEach(() => {
      mockTheme = 'system';
    });

    it('highlights system button when theme is system', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const systemButton = screen.getByLabelText('System theme');
        expect(systemButton).toHaveClass('bg-[#faf9f5]', 'text-[#788c5d]', 'shadow-sm');
      });
    });

    it('does not highlight light button when theme is system', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        expect(lightButton).toHaveClass('text-[#b0aea5]');
        expect(lightButton).not.toHaveClass('text-[#d97757]');
      });
    });

    it('does not highlight dark button when theme is system', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        expect(darkButton).toHaveClass('text-[#b0aea5]');
        expect(darkButton).not.toHaveClass('text-[#6a9bcc]');
      });
    });
  });

  describe('Click Handlers', () => {
    it('calls setTheme with "light" when light button is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
      });

      const lightButton = screen.getByLabelText('Light mode');
      await user.click(lightButton);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('calls setTheme with "dark" when dark button is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
      });

      const darkButton = screen.getByLabelText('Dark mode');
      await user.click(darkButton);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('calls setTheme with "system" when system button is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('System theme')).toBeInTheDocument();
      });

      const systemButton = screen.getByLabelText('System theme');
      await user.click(systemButton);

      expect(mockSetTheme).toHaveBeenCalledWith('system');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('allows switching between themes', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
      });

      // Click dark
      await user.click(screen.getByLabelText('Dark mode'));
      expect(mockSetTheme).toHaveBeenCalledWith('dark');

      // Click system
      await user.click(screen.getByLabelText('System theme'));
      expect(mockSetTheme).toHaveBeenCalledWith('system');

      // Click light
      await user.click(screen.getByLabelText('Light mode'));
      expect(mockSetTheme).toHaveBeenCalledWith('light');

      expect(mockSetTheme).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for all buttons', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
        expect(screen.getByLabelText('System theme')).toBeInTheDocument();
      });
    });

    it('buttons are keyboard accessible', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);

        buttons.forEach(button => {
          expect(button.tagName).toBe('BUTTON');
        });
      });
    });

    it('maintains button order (light, dark, system)', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAttribute('aria-label', 'Light mode');
        expect(buttons[1]).toHaveAttribute('aria-label', 'Dark mode');
        expect(buttons[2]).toHaveAttribute('aria-label', 'System theme');
      });
    });
  });

  describe('Styling and CSS Classes', () => {
    it('all buttons have base classes', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
          expect(button).toHaveClass('rounded-full', 'p-2', 'transition-colors');
        });
      });
    });

    it('inactive buttons have hover states', async () => {
      mockTheme = 'light';
      render(<ThemeToggle />);

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        const systemButton = screen.getByLabelText('System theme');

        // Both should have hover classes since they're inactive
        expect(darkButton).toHaveClass('hover:text-[#141413]');
        expect(systemButton).toHaveClass('hover:text-[#141413]');
      });
    });

    it('active button has shadow', async () => {
      mockTheme = 'light';
      render(<ThemeToggle />);

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        expect(lightButton).toHaveClass('shadow-sm');
      });
    });
  });

  describe('Component Integration', () => {
    it('renders without crashing', () => {
      expect(() => render(<ThemeToggle />)).not.toThrow();
    });

    it('renders consistently on multiple renders', async () => {
      const { rerender } = render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
      });

      rerender(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
        expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
        expect(screen.getByLabelText('System theme')).toBeInTheDocument();
      });
    });

    it('does not have any required props', () => {
      expect(() => render(<ThemeToggle />)).not.toThrow();
    });
  });

  describe('Anthropic Brand Colors', () => {
    it('uses Anthropic orange for light mode', async () => {
      mockTheme = 'light';
      render(<ThemeToggle />);

      await waitFor(() => {
        const lightButton = screen.getByLabelText('Light mode');
        expect(lightButton).toHaveClass('text-[#d97757]');
      });
    });

    it('uses Anthropic blue for dark mode', async () => {
      mockTheme = 'dark';
      render(<ThemeToggle />);

      await waitFor(() => {
        const darkButton = screen.getByLabelText('Dark mode');
        expect(darkButton).toHaveClass('text-[#6a9bcc]');
      });
    });

    it('uses Anthropic green for system mode', async () => {
      mockTheme = 'system';
      render(<ThemeToggle />);

      await waitFor(() => {
        const systemButton = screen.getByLabelText('System theme');
        expect(systemButton).toHaveClass('text-[#788c5d]');
      });
    });

    it('uses Anthropic gray for container background', async () => {
      const { container } = render(<ThemeToggle />);

      await waitFor(() => {
        const wrapper = container.querySelector('div');
        expect(wrapper).toHaveClass('bg-[#e8e6dc]');
      });
    });
  });
});
