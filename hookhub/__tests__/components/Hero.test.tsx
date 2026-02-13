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

    it('has semi-transparent Anthropic light background', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-[#faf9f5]/80');
    });

    it('has backdrop blur effect', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-lg');
    });

    it('has Anthropic border color', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('border-[#e8e6dc]');
    });

    it('has dark mode background class', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('dark:bg-[#141413]/80');
    });

    it('has dark mode border class', () => {
      const { container } = render(<Hero />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('dark:border-[#b0aea5]/50');
    });
  });

  describe('Styling - Icon Container', () => {
    it('has rounded corners', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.rounded-xl.bg-\\[\\#d97757\\]');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('rounded-xl');
    });

    it('has Anthropic orange background', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.bg-\\[\\#d97757\\]');
      expect(iconContainer).toHaveClass('bg-[#d97757]');
    });

    it('has padding', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.bg-\\[\\#d97757\\]');
      expect(iconContainer).toHaveClass('p-2.5');
    });

    it('icon has Anthropic light color', () => {
      const { container } = render(<Hero />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-[#faf9f5]');
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

    it('title has Anthropic dark color (light mode)', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('text-[#141413]');
    });

    it('title has Anthropic light color (dark mode)', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');
      expect(title).toHaveClass('dark:text-[#faf9f5]');
    });

    it('tagline has small font size', () => {
      render(<Hero />);
      const tagline = screen.getByText('Discover Claude Code hooks');
      expect(tagline).toHaveClass('text-sm');
    });

    it('tagline has Anthropic mid-gray color', () => {
      render(<Hero />);
      const tagline = screen.getByText('Discover Claude Code hooks');
      expect(tagline).toHaveClass('text-[#b0aea5]');
    });

    it('tagline has same color in dark mode', () => {
      render(<Hero />);
      const tagline = screen.getByText('Discover Claude Code hooks');
      expect(tagline).toHaveClass('dark:text-[#b0aea5]');
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
    it('maintains Anthropic brand color scheme', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.bg-\\[\\#d97757\\]');

      // Anthropic orange accent
      expect(iconContainer).toHaveClass('bg-[#d97757]');
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
        'border-[#e8e6dc]',
        'bg-[#faf9f5]/80',
        'backdrop-blur-lg',
        'dark:border-[#b0aea5]/50',
        'dark:bg-[#141413]/80'
      ];

      requiredClasses.forEach(className => {
        expect(header).toHaveClass(className);
      });
    });

    it('title has all required text classes', () => {
      render(<Hero />);
      const title = screen.getByText('HookHub');

      const requiredClasses = [
        'text-3xl',
        'font-bold',
        'tracking-tight',
        'text-[#141413]',
        'dark:text-[#faf9f5]'
      ];

      requiredClasses.forEach(className => {
        expect(title).toHaveClass(className);
      });
    });

    it('icon container has all required classes', () => {
      const { container } = render(<Hero />);
      const iconContainer = container.querySelector('.rounded-xl.bg-\\[\\#d97757\\]');

      const requiredClasses = [
        'rounded-xl',
        'bg-[#d97757]',
        'p-2.5',
        'shadow-sm'
      ];

      requiredClasses.forEach(className => {
        expect(iconContainer).toHaveClass(className);
      });
    });
  });
});
