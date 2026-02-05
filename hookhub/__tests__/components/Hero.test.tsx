import { render, screen } from '@testing-library/react';
import Hero from '@/app/components/heros/Hero';

// Mock the ThemeToggle component
jest.mock('@/app/components/ThemeToggle', () => {
  return function ThemeToggle() {
    return <button data-testid="theme-toggle">Toggle Theme</button>;
  };
});

describe('Hero Component', () => {
  describe('Rendering', () => {
    it('renders the header element', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('renders the HookHub title', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toBeInTheDocument();
    });

    it('renders the tagline', () => {
      render(<Hero />);
      const tagline = screen.getByText('Discover Claude Code hooks');
      expect(tagline).toBeInTheDocument();
    });

    it('renders the Webhook icon', () => {
      const { container } = render(<Hero />);
      // Lucide icons render as SVG elements
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders the ThemeToggle component', () => {
      render(<Hero />);
      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toBeInTheDocument();
    });
  });

  describe('Semantic HTML Structure', () => {
    it('uses header semantic element', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('uses h1 for main title', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('HookHub');
    });

    it('uses paragraph element for tagline', () => {
      const { container } = render(<Hero />);
      const paragraphs = container.querySelectorAll('p');
      const tagline = Array.from(paragraphs).find(p =>
        p.textContent === 'Discover Claude Code hooks'
      );
      expect(tagline).toBeInTheDocument();
    });

    it('maintains proper heading hierarchy', () => {
      render(<Hero />);
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName).toBe('H1');
    });
  });

  describe('Layout Structure', () => {
    it('has max-width container', () => {
      const { container } = render(<Hero />);
      const maxWidthDiv = container.querySelector('.max-w-7xl');
      expect(maxWidthDiv).toBeInTheDocument();
    });

    it('has flex layout for logo and theme toggle', () => {
      const { container } = render(<Hero />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    it('groups icon and text together', () => {
      const { container } = render(<Hero />);
      const leftGroup = container.querySelector('.flex.items-center.gap-3');
      expect(leftGroup).toBeInTheDocument();
    });
  });

  describe('Styling - Header', () => {
    it('has border bottom', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('border-b');
    });

    it('has semi-transparent white background (light mode)', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white/80');
    });

    it('has backdrop blur effect', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-lg');
    });

    it('has border color with opacity', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('border-gray-200/50');
    });

    it('has dark mode background class', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('dark:bg-gray-900/80');
    });

    it('has dark mode border class', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('dark:border-gray-800/50');
    });
  });

  describe('Styling - Icon Container', () => {
    it('has rounded corners', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.rounded-xl.bg-gradient-to-br');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('rounded-xl');
    });

    it('has gradient background from blue to purple', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.bg-gradient-to-br');
      expect(iconContainer).toHaveClass('from-blue-500');
      expect(iconContainer).toHaveClass('to-purple-600');
    });

    it('has padding', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.bg-gradient-to-br');
      expect(iconContainer).toHaveClass('p-2.5');
    });

    it('icon has white text color', () => {
      const { container } = render(<Hero />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-white');
    });

    it('icon has correct size', () => {
      const { container } = render(<Hero />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-6');
      expect(svg).toHaveClass('w-6');
    });
  });

  describe('Styling - Typography', () => {
    it('title has large font size', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('text-3xl');
    });

    it('title has bold font weight', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('font-bold');
    });

    it('title has tight tracking', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('tracking-tight');
    });

    it('title has gradient background clip', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('bg-gradient-to-r');
      expect(title).toHaveClass('bg-clip-text');
      expect(title).toHaveClass('text-transparent');
    });

    it('title has correct gradient colors (light mode)', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('from-gray-900');
      expect(title).toHaveClass('to-gray-600');
    });

    it('title has dark mode gradient colors', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('dark:from-white');
      expect(title).toHaveClass('dark:to-gray-400');
    });

    it('tagline has small font size', () => {
      render(<Hero />);
      const tagline = screen.getByText('Discover Claude Code hooks');
      expect(tagline).toHaveClass('text-sm');
    });

    it('tagline has gray color (light mode)', () => {
      render(<Hero />);
      const tagline = screen.getByText('Discover Claude Code hooks');
      expect(tagline).toHaveClass('text-gray-600');
    });

    it('tagline has dark mode color', () => {
      render(<Hero />);
      const tagline = screen.getByText('Discover Claude Code hooks');
      expect(tagline).toHaveClass('dark:text-gray-400');
    });
  });

  describe('Responsive Design', () => {
    it('has responsive horizontal padding', () => {
      const { container } = render(<Hero />);
      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toHaveClass('px-4');
      expect(innerContainer).toHaveClass('sm:px-6');
      expect(innerContainer).toHaveClass('lg:px-8');
    });

    it('has vertical padding', () => {
      const { container } = render(<Hero />);
      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toHaveClass('py-6');
    });

    it('maintains flex layout at all breakpoints', () => {
      const { container } = render(<Hero />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toHaveClass('flex');
      expect(flexContainer).toHaveClass('items-center');
      expect(flexContainer).toHaveClass('justify-between');
    });
  });

  describe('Spacing and Gaps', () => {
    it('has gap between icon and text', () => {
      const { container } = render(<Hero />);
      const leftGroup = container.querySelector('.flex.items-center.gap-3');
      expect(leftGroup).toHaveClass('gap-3');
    });

    it('centers items vertically in flex container', () => {
      const { container } = render(<Hero />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toHaveClass('items-center');
    });

    it('spaces items with justify-between', () => {
      const { container } = render(<Hero />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toHaveClass('justify-between');
    });
  });

  describe('Component Integration', () => {
    it('integrates ThemeToggle component', () => {
      render(<Hero />);
      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toBeInTheDocument();
    });

    it('positions ThemeToggle on the right', () => {
      const { container } = render(<Hero />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      const children = flexContainer?.children;

      expect(children).toHaveLength(2);
      // ThemeToggle should be the second child (right side)
      expect(children?.[1]).toContainElement(screen.getByTestId('theme-toggle'));
    });
  });

  describe('Accessibility', () => {
    it('has accessible heading structure', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('provides text alternative for branding', () => {
      render(<Hero />);
      expect(screen.getByText('HookHub')).toBeInTheDocument();
      expect(screen.getByText('Discover Claude Code hooks')).toBeInTheDocument();
    });

    it('uses semantic HTML for better screen reader support', () => {
      const { container } = render(<Hero />);
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('maintains logical document outline', () => {
      render(<Hero />);
      const headings = screen.getAllByRole('heading');

      // Should only have one H1
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName).toBe('H1');
    });
  });

  describe('Visual Consistency', () => {
    it('maintains brand color scheme', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.bg-gradient-to-br');

      // Brand gradient: blue-500 to purple-600
      expect(iconContainer).toHaveClass('from-blue-500');
      expect(iconContainer).toHaveClass('to-purple-600');
    });

    it('uses consistent max-width with application', () => {
      const { container } = render(<Hero />);
      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toBeInTheDocument();
    });

    it('applies backdrop blur for depth effect', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-lg');
    });
  });

  describe('Component Isolation', () => {
    it('renders without crashing', () => {
      const { container } = render(<Hero />);
      expect(container).toBeInTheDocument();
    });

    it('renders consistently on multiple renders', () => {
      const { rerender } = render(<Hero />);
      expect(screen.getByText('HookHub')).toBeInTheDocument();

      rerender(<Hero />);
      expect(screen.getByText('HookHub')).toBeInTheDocument();
      expect(screen.getByText('Discover Claude Code hooks')).toBeInTheDocument();
    });

    it('does not have any required props', () => {
      // Should render without any props
      expect(() => render(<Hero />)).not.toThrow();
    });
  });

  describe('Container Structure', () => {
    it('centers content with mx-auto', () => {
      const { container } = render(<Hero />);
      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toHaveClass('mx-auto');
    });

    it('has proper nesting structure', () => {
      const { container } = render(<Hero />);

      // header > div.max-w-7xl > div.flex > [left group, theme toggle]
      const header = container.querySelector('header');
      const maxWidth = header?.querySelector('.max-w-7xl');
      const flexContainer = maxWidth?.querySelector('.flex.items-center.justify-between');

      expect(header).toBeInTheDocument();
      expect(maxWidth).toBeInTheDocument();
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('CSS Classes Validation', () => {
    it('header has all required classes', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');

      const requiredClasses = [
        'border-b',
        'border-gray-200/50',
        'bg-white/80',
        'backdrop-blur-lg',
        'dark:border-gray-800/50',
        'dark:bg-gray-900/80'
      ];

      requiredClasses.forEach(className => {
        expect(header).toHaveClass(className);
      });
    });

    it('title has all gradient text classes', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');

      const requiredClasses = [
        'text-3xl',
        'font-bold',
        'tracking-tight',
        'bg-gradient-to-r',
        'from-gray-900',
        'to-gray-600',
        'bg-clip-text',
        'text-transparent',
        'dark:from-white',
        'dark:to-gray-400'
      ];

      requiredClasses.forEach(className => {
        expect(title).toHaveClass(className);
      });
    });

    it('icon container has all required classes', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.rounded-xl.bg-gradient-to-br');

      const requiredClasses = [
        'rounded-xl',
        'bg-gradient-to-br',
        'from-blue-500',
        'to-purple-600',
        'p-2.5'
      ];

      requiredClasses.forEach(className => {
        expect(iconContainer).toHaveClass(className);
      });
    });
  });
});
