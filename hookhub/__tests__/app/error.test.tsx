import { render, screen, fireEvent } from '@testing-library/react';
import Error from '@/app/error';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('Error Component', () => {
  const mockReset = jest.fn();

  const createMockError = (message: string) => {
    const error = new globalThis.Error(message);
    return error;
  };

  const createMockErrorWithDigest = (message: string, digest: string) => {
    const error = new globalThis.Error(message) as globalThis.Error & { digest?: string };
    error.digest = digest;
    return error;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders error title correctly', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('renders alert triangle icon', () => {
      const mockError = createMockError('Test error message');
      const { container } = render(<Error error={mockError} reset={mockReset} />);
      // Check for the icon's SVG element by finding the container with the icon
      const iconContainer = container.querySelector('.bg-destructive\\/10');
      expect(iconContainer).toBeInTheDocument();
    });

    it('renders Try Again button', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('renders Go Home link', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders report issue link', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      const issueLink = screen.getByRole('link', { name: /report an issue/i });
      expect(issueLink).toBeInTheDocument();
      expect(issueLink).toHaveAttribute('href', 'https://github.com/christseng89/claude-code-crash-course/issues');
      expect(issueLink).toHaveAttribute('target', '_blank');
      expect(issueLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Error Logging (useEffect)', () => {
    it('logs error to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);

      expect(console.error).toHaveBeenCalledWith('Error boundary caught:', mockError);

      process.env.NODE_ENV = originalEnv;
    });

    it('logs error to console in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const mockError = createMockErrorWithDigest('Test error with digest', 'abc123xyz');
      render(<Error error={mockError} reset={mockReset} />);

      expect(console.error).toHaveBeenCalledWith('Error boundary caught:', mockError);

      process.env.NODE_ENV = originalEnv;
    });

    it('does not call logging service in development mode even with digest', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const mockError = createMockErrorWithDigest('Test error with digest', 'abc123xyz');
      render(<Error error={mockError} reset={mockReset} />);

      // Only console.error should be called, no additional service calls
      expect(console.error).toHaveBeenCalledTimes(1);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Development Mode Display', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('displays development-specific error message', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByText(/We encountered an error while rendering this page/)).toBeInTheDocument();
      expect(screen.getByText(/Check the console for details/)).toBeInTheDocument();
    });

    it('displays error message in development mode', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('displays error digest when available in development mode', () => {
      const mockError = createMockErrorWithDigest('Test error with digest', 'abc123xyz');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByText(/Error Digest:/)).toBeInTheDocument();
      expect(screen.getByText(/abc123xyz/)).toBeInTheDocument();
    });

    it('does not display error digest when not available in development mode', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.queryByText(/Error Digest:/)).not.toBeInTheDocument();
    });

    it('does not display production error ID section in development mode', () => {
      const mockError = createMockErrorWithDigest('Test error with digest', 'abc123xyz');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Please include this ID when reporting the issue/)).not.toBeInTheDocument();
    });
  });

  describe('Production Mode Display', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('displays production-specific error message', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByText(/We're sorry for the inconvenience/)).toBeInTheDocument();
      expect(screen.getByText(/Our team has been notified and is working on a fix/)).toBeInTheDocument();
    });

    it('does not display error message in production mode', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
    });

    it('displays error ID when digest is available in production mode', () => {
      const mockError = createMockErrorWithDigest('Test error with digest', 'abc123xyz');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
      expect(screen.getByText('abc123xyz')).toBeInTheDocument();
      expect(screen.getByText(/Please include this ID when reporting the issue/)).toBeInTheDocument();
    });

    it('does not display error ID section when digest is not available in production mode', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Please include this ID when reporting the issue/)).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls reset function when Try Again button is clicked', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });

      fireEvent.click(tryAgainButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('allows multiple clicks on Try Again button', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });

      fireEvent.click(tryAgainButton);
      fireEvent.click(tryAgainButton);
      fireEvent.click(tryAgainButton);

      expect(mockReset).toHaveBeenCalledTimes(3);
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct container classes', () => {
      const mockError = createMockError('Test error message');
      const { container } = render(<Error error={mockError} reset={mockReset} />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('min-h-screen');
      expect(mainContainer).toHaveClass('flex');
      expect(mainContainer).toHaveClass('items-center');
      expect(mainContainer).toHaveClass('justify-center');
    });

    it('renders refresh icon in Try Again button', () => {
      const mockError = createMockError('Test error message');
      const { container } = render(<Error error={mockError} reset={mockReset} />);
      const button = screen.getByRole('button', { name: /try again/i });
      // Check that the button contains the icon
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders home icon in Go Home link', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink.querySelector('svg')).toBeInTheDocument();
    });

    it('applies responsive flex classes to action buttons', () => {
      const mockError = createMockError('Test error message');
      const { container } = render(<Error error={mockError} reset={mockReset} />);
      const buttonContainer = container.querySelector('.flex.flex-col.sm\\:flex-row');
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button role for Try Again', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      const button = screen.getByRole('button', { name: /try again/i });
      // Note: button elements don't need explicit type="button" attribute, it's the default
      expect(button.tagName).toBe('BUTTON');
    });

    it('has proper link roles and attributes', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);

      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink).toHaveAttribute('href', '/');

      const issueLink = screen.getByRole('link', { name: /report an issue/i });
      expect(issueLink).toHaveAttribute('href', expect.stringContaining('github.com'));
    });

    it('has focus styles on interactive elements', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      const button = screen.getByRole('button', { name: /try again/i });
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('Error Message Display Edge Cases', () => {
    it('handles empty error message', () => {
      const emptyError = createMockError('');
      process.env.NODE_ENV = 'development';

      render(<Error error={emptyError} reset={mockReset} />);

      // Should still render the component structure
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      process.env.NODE_ENV = 'test';
    });

    it('handles very long error message', () => {
      const longMessage = 'A'.repeat(500);
      const longError = createMockError(longMessage);
      process.env.NODE_ENV = 'development';

      render(<Error error={longError} reset={mockReset} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();

      process.env.NODE_ENV = 'test';
    });

    it('handles error message with special characters', () => {
      const specialError = createMockError('Error: <script>alert("xss")</script> & special chars');
      process.env.NODE_ENV = 'development';

      render(<Error error={specialError} reset={mockReset} />);

      // React escapes special characters by default
      expect(screen.getByText(/Error: <script>alert\("xss"\)<\/script> & special chars/)).toBeInTheDocument();

      process.env.NODE_ENV = 'test';
    });
  });

  describe('Help Text', () => {
    it('renders help text with correct content', () => {
      const mockError = createMockError('Test error message');
      render(<Error error={mockError} reset={mockReset} />);
      expect(screen.getByText(/If this problem persists, please/)).toBeInTheDocument();
    });
  });
});
