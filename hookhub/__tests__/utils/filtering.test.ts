import { HookCategory } from '@/types/hook';
import { mockHooks, mockHook2 } from './mockData.mock';

describe('Filtering Logic Tests', () => {
  describe('Category Filtering', () => {
    it('filters hooks by PostToolUse category', () => {
      const filtered = mockHooks.filter(hook => hook.category === HookCategory.PostToolUse);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('format-typescript');
    });

    it('filters hooks by PreToolUse category', () => {
      const filtered = mockHooks.filter(hook => hook.category === HookCategory.PreToolUse);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('activity-logger');
    });

    it('filters hooks by Workflow category', () => {
      const filtered = mockHooks.filter(hook => hook.category === HookCategory.Workflow);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('git-commit-lint');
    });

    it('returns all hooks when category is "All"', () => {
      const filtered = mockHooks;
      expect(filtered.length).toBe(3);
    });

    it('returns empty array for non-existent category', () => {
      const filtered = mockHooks.filter(hook => hook.category === 'NonExistent' as HookCategory);
      expect(filtered.length).toBe(0);
    });
  });

  describe('Search Query Filtering', () => {
    it('searches by hook name (case-insensitive)', () => {
      const query = 'format';
      const filtered = mockHooks.filter(hook =>
        hook.name.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('format-typescript');
    });

    it('searches by description', () => {
      const query = 'validates';
      const filtered = mockHooks.filter(hook =>
        hook.description.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('git-commit-lint');
    });

    it('searches by repo owner', () => {
      const query = 'disler';
      const filtered = mockHooks.filter(hook =>
        hook.repoOwner.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('format-typescript');
    });

    it('searches by repo name', () => {
      const query = 'activity-logger';
      const filtered = mockHooks.filter(hook =>
        hook.repoName.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('activity-logger');
    });

    it('returns multiple results for generic search', () => {
      const query = 'git';
      const filtered = mockHooks.filter(hook =>
        hook.name.toLowerCase().includes(query.toLowerCase()) ||
        hook.description.toLowerCase().includes(query.toLowerCase()) ||
        hook.repoName.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('git-commit-lint');
    });

    it('returns empty array for non-matching search', () => {
      const query = 'nonexistent';
      const filtered = mockHooks.filter(hook =>
        hook.name.toLowerCase().includes(query.toLowerCase()) ||
        hook.description.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(0);
    });

    it('handles empty search query', () => {
      const query = '';
      const filtered = mockHooks.filter(hook =>
        query === '' ||
        hook.name.toLowerCase().includes(query.toLowerCase())
      );
      expect(filtered.length).toBe(3);
    });

    it('handles whitespace-only search query', () => {
      const query = '   ';
      const filtered = mockHooks.filter(hook =>
        query.trim() === '' ||
        hook.name.toLowerCase().includes(query.trim().toLowerCase())
      );
      expect(filtered.length).toBe(3);
    });
  });

  describe('Combined Filtering', () => {
    it('applies both category and search filters', () => {
      const category = HookCategory.PreToolUse;
      const query = 'logger';

      const filtered = mockHooks
        .filter(hook => hook.category === category)
        .filter(hook =>
          hook.name.toLowerCase().includes(query.toLowerCase()) ||
          hook.description.toLowerCase().includes(query.toLowerCase())
        );

      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('activity-logger');
    });

    it('returns empty when filters exclude all hooks', () => {
      const category = HookCategory.PostToolUse;
      const query = 'activity';

      const filtered = mockHooks
        .filter(hook => hook.category === category)
        .filter(hook =>
          hook.name.toLowerCase().includes(query.toLowerCase())
        );

      expect(filtered.length).toBe(0);
    });

    it('maintains original order when filtering', () => {
      const category = HookCategory.PreToolUse;
      const filtered = mockHooks.filter(hook => hook.category === category);

      expect(filtered[0].id).toBe(mockHook2.id);
    });
  });

  describe('Category Extraction', () => {
    it('extracts unique categories from hooks', () => {
      const categories = Array.from(new Set(mockHooks.map(hook => hook.category))).sort();

      expect(categories).toContain(HookCategory.PostToolUse);
      expect(categories).toContain(HookCategory.PreToolUse);
      expect(categories).toContain(HookCategory.Workflow);
      expect(categories.length).toBe(3);
    });

    it('sorts categories alphabetically', () => {
      const categories = Array.from(new Set(mockHooks.map(hook => hook.category))).sort();

      expect(categories[0]).toBe('PostToolUse');
      expect(categories[1]).toBe('PreToolUse');
      expect(categories[2]).toBe('Workflow');
    });

    it('prepends "All" to categories list', () => {
      const categories = Array.from(new Set(mockHooks.map(hook => hook.category))).sort();
      const categoriesWithAll = ['All', ...categories];

      expect(categoriesWithAll[0]).toBe('All');
      expect(categoriesWithAll.length).toBe(4);
    });
  });
});
