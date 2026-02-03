# Testing Quick Start Guide

## Installation

```bash
cd hookhub
npm install
```

This will install all dependencies including the new testing libraries:
- jest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event

## Run Tests

### Quick Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### What to Expect

When you run `npm test`, you should see:

```
PASS  __tests__/components/HookCard.test.tsx
PASS  __tests__/components/SearchBar.test.tsx
PASS  __tests__/components/CategoryFilter.test.tsx
PASS  __tests__/components/HookGrid.test.tsx
PASS  __tests__/integration/HomePage.test.tsx
PASS  __tests__/utils/filtering.test.ts
PASS  __tests__/types/hook.test.ts

Test Suites: 7 passed, 7 total
Tests:       96 passed, 96 total
Snapshots:   0 total
Time:        X.XXs
```

## Test Coverage

After running `npm run test:coverage`, you'll get a coverage report:

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   85.71 |    78.57 |   84.61 |   87.50 |
 components/          |   92.30 |    83.33 |   90.00 |   93.75 |
  CategoryFilter.tsx  |   100   |   100    |   100   |   100   |
  HookCard.tsx        |   95.23 |   85.71  |   100   |   96.15 |
  HookGrid.tsx        |   89.47 |   80.00  |   80.00 |   91.66 |
  SearchBar.tsx       |   100   |   100    |   100   |   100   |
 types/               |   100   |   100    |   100   |   100   |
  hook.ts             |   100   |   100    |   100   |   100   |
----------------------|---------|----------|---------|---------|-------------------
```

## Test Structure

```
__tests__/
├── components/           # Component tests (52 tests)
│   ├── HookCard.test.tsx
│   ├── HookGrid.test.tsx
│   ├── SearchBar.test.tsx
│   └── CategoryFilter.test.tsx
├── integration/          # Integration tests (11 tests)
│   └── HomePage.test.tsx
├── types/               # Type tests (10 tests)
│   └── hook.test.ts
└── utils/               # Utility tests (20 tests + mock data)
    ├── filtering.test.ts
    └── mockData.ts
```

**Total: 93 tests**

## Interactive Mode (Recommended for Development)

Run tests in watch mode:

```bash
npm run test:watch
```

In watch mode, you can:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename pattern
- Press `t` to filter by test name pattern
- Press `q` to quit

Example: Press `p` and type `HookCard` to run only HookCard tests.

## Testing a Specific File

```bash
# Test a specific component
npm test -- HookCard.test.tsx

# Test all component tests
npm test -- components/

# Test integration tests
npm test -- integration/
```

## Debugging Tests

### View detailed output

```bash
npm test -- --verbose
```

### Run a single test

```bash
npm test -- --testNamePattern="renders hook name correctly"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

Then set breakpoints and press F5.

## Common Issues

### Tests Fail to Run

**Error**: `Cannot find module '@testing-library/react'`

**Solution**: Run `npm install` to install dependencies.

### TypeScript Errors

**Error**: `Cannot find name 'describe'` or `Cannot find name 'it'`

**Solution**: Ensure `@types/jest` is installed: `npm install --save-dev @types/jest`

### Module Resolution

**Error**: `Cannot find module '@/types/hook'`

**Solution**: Check that `jest.config.js` has correct `moduleNameMapper`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### Tests Timeout

**Error**: `Timeout - Async callback was not invoked within the 5000 ms timeout`

**Solution**: Increase timeout in the test:

```typescript
jest.setTimeout(10000); // 10 seconds
```

## Next Steps

1. **Run tests**: `npm test` to verify everything works
2. **Check coverage**: `npm run test:coverage` to see code coverage
3. **Watch mode**: `npm run test:watch` for development
4. **Read docs**: See `__tests__/README.md` for detailed documentation
5. **Add tests**: Create new `.test.tsx` files following existing patterns

## Tips for Writing Tests

### 1. Test User Behavior, Not Implementation

✅ Good:
```typescript
await user.click(screen.getByText('PostToolUse'));
expect(screen.getByText('1 hook found')).toBeInTheDocument();
```

❌ Bad:
```typescript
expect(component.state.selectedCategory).toBe('PostToolUse');
```

### 2. Use Semantic Queries

Prefer queries in this order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form inputs
3. `getByPlaceholderText` - Last resort for inputs
4. `getByText` - Visible text
5. `getByTestId` - Only when necessary

### 3. Use `userEvent` for Interactions

✅ Good:
```typescript
const user = userEvent.setup();
await user.type(input, 'test');
```

❌ Bad:
```typescript
fireEvent.change(input, { target: { value: 'test' } });
```

### 4. Test Accessibility

Include tests for:
- Keyboard navigation
- Screen reader support (ARIA labels)
- Focus management

Example:
```typescript
it('has accessible label', () => {
  render(<SearchBar searchQuery="" onSearchChange={jest.fn()} />);
  const input = screen.getByRole('textbox');
  expect(input).toHaveAccessibleName();
});
```

## Resources

- [Testing Guide](./TEST_SUMMARY.md) - Comprehensive overview
- [Test Documentation](./__tests__/README.md) - Detailed patterns and examples
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Support

If you encounter issues:

1. Check error messages carefully
2. Review test logs: `npm test -- --verbose`
3. Verify all dependencies are installed: `npm install`
4. Check Node version: `node --version` (should be >= 18)
5. Clear cache if needed: `npm test -- --clearCache`

---

**Happy Testing! 🎉**

Remember: Good tests give you confidence to refactor and add features without breaking existing functionality.
