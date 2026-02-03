import { render, screen } from '@testing-library/react';
import ThemeProvider from '@/app/components/ThemeProvider';

// Mock next-themes is already set up in jest.setup.js
// We'll verify it's being called correctly

describe('ThemeProvider Component', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child-element">Test Child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('renders nested components', () => {
    render(
      <ThemeProvider>
        <div>
          <header data-testid="header">Header</header>
          <main data-testid="main">
            <article>Article Content</article>
          </main>
          <footer data-testid="footer">Footer</footer>
        </div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Article Content')).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    const { container } = render(
      <ThemeProvider>
        {null}
      </ThemeProvider>
    );

    // Should render without errors
    expect(container).toBeInTheDocument();
  });

  it('passes React elements as children', () => {
    const CustomComponent = () => <div data-testid="custom">Custom Component</div>;

    render(
      <ThemeProvider>
        <CustomComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.getByText('Custom Component')).toBeInTheDocument();
  });

  it('handles fragments as children', () => {
    render(
      <ThemeProvider>
        <>
          <div data-testid="fragment-child-1">Fragment Child 1</div>
          <div data-testid="fragment-child-2">Fragment Child 2</div>
        </>
      </ThemeProvider>
    );

    expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
    expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
  });

  it('preserves child component props', () => {
    render(
      <ThemeProvider>
        <button
          data-testid="test-button"
          className="test-class"
          aria-label="Test Button"
        >
          Click Me
        </button>
      </ThemeProvider>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('test-class');
    expect(button).toHaveAttribute('aria-label', 'Test Button');
    expect(button).toHaveTextContent('Click Me');
  });

  it('does not modify children structure', () => {
    const { container } = render(
      <ThemeProvider>
        <div className="parent">
          <span className="child">Content</span>
        </div>
      </ThemeProvider>
    );

    const parent = container.querySelector('.parent');
    const child = container.querySelector('.child');

    expect(parent).toBeInTheDocument();
    expect(child).toBeInTheDocument();
    expect(parent).toContainElement(child);
  });

  it('works with complex nested structures', () => {
    render(
      <ThemeProvider>
        <div>
          <nav>
            <ul>
              <li data-testid="nav-item">Item 1</li>
            </ul>
          </nav>
          <main>
            <section>
              <article data-testid="article">Article</article>
            </section>
          </main>
        </div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('nav-item')).toBeInTheDocument();
    expect(screen.getByTestId('article')).toBeInTheDocument();
  });

  it('handles conditional rendering in children', () => {
    const showContent = true;

    render(
      <ThemeProvider>
        {showContent && <div data-testid="conditional">Conditional Content</div>}
      </ThemeProvider>
    );

    expect(screen.getByTestId('conditional')).toBeInTheDocument();
  });
});
