# HookHub Test Suite

Comprehensive test suite for the HookHub application using Jest and React Testing Library.

## Test Structure

```
__tests__/
├── components/           # Component unit tests
│   ├── HookCard.test.tsx
│   ├── HookGrid.test.tsx
│   ├── SearchBar.test.tsx
│   └── CategoryFilter.test.tsx
├── integration/          # Integration tests
│   └── HomePage.test.tsx
├── types/               # Type definition tests
│   └── hook.test.ts
├── utils/               # Utility tests and mock data
│   ├── mockData.ts
│   └── filtering.test.ts
└── README.md
```

## Running Tests

```bash
# Install dependencies first
npm install

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Test Coverage

The test suite aims for the following coverage targets:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 80%
- **Statements**: 80%

View coverage report after running `npm run test:coverage` in the `coverage/` directory.

## Test Files Overview

### Component Tests

#### `HookCard.test.tsx`
Tests for the HookCard component including:
- Rendering hook information (name, description, category)
- GitHub stats display
- Tag rendering and limiting
- Category badge colors
- Link attributes
- Hover effects

**Coverage**: 12 test cases

#### `HookGrid.test.tsx`
Tests for the HookGrid component including:
- Initial rendering of all hooks
- Category filtering
- Search functionality (name, description, owner, repo)
- Combined filtering
- Results count display
- Empty state
- Component composition

**Coverage**: 20 test cases

#### `SearchBar.test.tsx`
Tests for the SearchBar component including:
- Input rendering and value display
- onChange callback
- User typing interactions
- Focus management
- Rapid typing handling

**Coverage**: 9 test cases

#### `CategoryFilter.test.tsx`
Tests for the CategoryFilter component including:
- Category button rendering
- Selection state
- Click handlers
- Style application
- Category switching
- Accessibility features

**Coverage**: 11 test cases

### Integration Tests

#### `HomePage.test.tsx`
End-to-end tests for the main page including:
- Layout rendering (header, footer, main)
- Initial data loading
- Complete user workflows (search + filter)
- Empty states
- Semantic HTML structure
- Link verification

**Coverage**: 11 test cases

### Utility Tests

#### `filtering.test.ts`
Tests for filtering logic including:
- Category filtering
- Search query filtering
- Combined filters
- Category extraction
- Edge cases

**Coverage**: 20 test cases

#### `hook.test.ts`
Tests for type definitions including:
- HookCategory enum validation
- Platform type validation
- Hook interface conformance
- Required vs optional fields
- Nested interface validation

**Coverage**: 10 test cases

## Mock Data

The `mockData.ts` file provides realistic test data:

- **mockHook**: Complete hook with all fields (PostToolUse category)
- **mockHook2**: Alternative hook (PreToolUse category)
- **mockHook3**: Third hook (Workflow category)
- **mockHooks**: Array of all mock hooks

These mocks include:
- GitHub stats (stars, forks, issues)
- Metadata (version, tags, license)
- Stats (installs, ratings, reviews)
- Quality metrics (verified, security audited)
- Author information
- Dependencies
- Platform compatibility

## Testing Patterns

### Component Testing Pattern

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  it('describes expected behavior', async () => {
    const user = userEvent.setup();
    render(<ComponentName {...props} />);

    // Assertions
    expect(screen.getByText('Expected Text')).toBeInTheDocument();

    // User interactions
    await user.click(screen.getByRole('button'));

    // Post-interaction assertions
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### Filtering Logic Pattern

```typescript
const filtered = hooks
  .filter(hook => category === 'All' || hook.category === category)
  .filter(hook =>
    query.trim() === '' ||
    hook.name.toLowerCase().includes(query.toLowerCase())
  );
```

## Key Testing Utilities

### React Testing Library Queries

- `getByText()` - Find element by text content
- `getByRole()` - Find element by ARIA role
- `getByPlaceholderText()` - Find input by placeholder
- `queryByText()` - Same as getBy but returns null instead of throwing
- `getAllByRole()` - Find all matching elements

### User Interactions

```typescript
const user = userEvent.setup();

await user.click(element);
await user.type(input, 'text');
await user.clear(input);
```

### Assertions

```typescript
expect(element).toBeInTheDocument();
expect(element).toHaveClass('className');
expect(element).toHaveAttribute('href', 'url');
expect(mockFn).toHaveBeenCalledWith(arg);
```

## Mocking

### Next.js Mocks

```typescript
// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));
```

### Data Mocks

```typescript
// Mock hooks.json data
jest.mock('@/app/data/hooks.json', () => ({
  hooks: [/* mock data */]
}));
```

## Best Practices

1. **Descriptive Test Names**: Use clear, behavior-focused test names
2. **AAA Pattern**: Arrange, Act, Assert
3. **User-Centric**: Test from user perspective, not implementation details
4. **Isolation**: Each test should be independent
5. **Mock External Dependencies**: Mock API calls, file reads, etc.
6. **Accessibility**: Test with screen reader queries (getByRole, getByLabelText)
7. **Edge Cases**: Test empty states, error states, boundary conditions

## Continuous Integration

The `test:ci` script is optimized for CI environments:
- `--ci`: Disables interactive features
- `--coverage`: Generates coverage report
- `--maxWorkers=2`: Limits parallel workers

Use in GitHub Actions:

```yaml
- name: Run Tests
  run: npm run test:ci
```

## Debugging Tests

### Run Single Test File

```bash
npm test -- HookCard.test.tsx
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="filters hooks"
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome and click "Open dedicated DevTools for Node".

## Common Issues

### Module Resolution

If you see module resolution errors, ensure `moduleNameMapper` in `jest.config.js` correctly maps `@/` to `<rootDir>/`.

### TypeScript Errors

Ensure `@types/jest` is installed and `tsconfig.json` includes Jest types.

### Timeout Errors

For slow tests, increase timeout:

```typescript
jest.setTimeout(10000); // 10 seconds
```

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure coverage targets are met
3. Run `npm run test:coverage` before committing
4. Update this README if adding new test patterns

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event](https://testing-library.com/docs/user-event/intro/)
- [Jest Matchers](https://jestjs.io/docs/expect)
