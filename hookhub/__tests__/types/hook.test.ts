import { HookCategory, Platform, Hook } from '@/types/hook';
import { mockHook } from '../utils/mockData.mock';

describe('Type Definitions', () => {
  describe('HookCategory Enum', () => {
    it('contains all expected hook categories', () => {
      expect(HookCategory.PreToolUse).toBe('PreToolUse');
      expect(HookCategory.PostToolUse).toBe('PostToolUse');
      expect(HookCategory.SessionStart).toBe('SessionStart');
      expect(HookCategory.SessionEnd).toBe('SessionEnd');
      expect(HookCategory.UserPromptSubmit).toBe('UserPromptSubmit');
      expect(HookCategory.PermissionRequest).toBe('PermissionRequest');
      expect(HookCategory.SubagentStop).toBe('SubagentStop');
      expect(HookCategory.PreCompact).toBe('PreCompact');
      expect(HookCategory.Stop).toBe('Stop');
      expect(HookCategory.Notification).toBe('Notification');
      expect(HookCategory.Utility).toBe('Utility');
      expect(HookCategory.Workflow).toBe('Workflow');
      expect(HookCategory.Other).toBe('Other');
    });

    it('has exactly 13 categories', () => {
      const categoryCount = Object.keys(HookCategory).length;
      expect(categoryCount).toBe(13);
    });
  });

  describe('Platform Type', () => {
    it('accepts valid platform values', () => {
      const platforms: Platform[] = ['Windows', 'macOS', 'Linux', 'All'];

      platforms.forEach(platform => {
        expect(['Windows', 'macOS', 'Linux', 'All']).toContain(platform);
      });
    });
  });

  describe('Hook Interface', () => {
    it('mockHook conforms to Hook interface', () => {
      expect(mockHook).toHaveProperty('id');
      expect(mockHook).toHaveProperty('name');
      expect(mockHook).toHaveProperty('category');
      expect(mockHook).toHaveProperty('description');
      expect(mockHook).toHaveProperty('repoUrl');
      expect(mockHook).toHaveProperty('repoOwner');
      expect(mockHook).toHaveProperty('repoName');
      expect(mockHook).toHaveProperty('github');
      expect(mockHook).toHaveProperty('metadata');
      expect(mockHook).toHaveProperty('stats');
      expect(mockHook).toHaveProperty('compatibility');
      expect(mockHook).toHaveProperty('quality');
      expect(mockHook).toHaveProperty('author');
      expect(mockHook).toHaveProperty('createdAt');
      expect(mockHook).toHaveProperty('updatedAt');
    });

    it('GitHubStats has required fields', () => {
      expect(mockHook.github).toHaveProperty('stars');
      expect(mockHook.github).toHaveProperty('forks');
      expect(mockHook.github).toHaveProperty('issues');
      expect(mockHook.github).toHaveProperty('lastSync');

      expect(typeof mockHook.github.stars).toBe('number');
      expect(typeof mockHook.github.forks).toBe('number');
      expect(typeof mockHook.github.issues).toBe('number');
      expect(typeof mockHook.github.lastSync).toBe('string');
    });

    it('HookMetadata has required fields', () => {
      expect(mockHook.metadata).toHaveProperty('version');
      expect(mockHook.metadata).toHaveProperty('hookTypes');
      expect(mockHook.metadata).toHaveProperty('matchers');
      expect(mockHook.metadata).toHaveProperty('tags');
      expect(mockHook.metadata).toHaveProperty('license');
      expect(mockHook.metadata).toHaveProperty('keywords');

      expect(Array.isArray(mockHook.metadata.hookTypes)).toBe(true);
      expect(Array.isArray(mockHook.metadata.matchers)).toBe(true);
      expect(Array.isArray(mockHook.metadata.tags)).toBe(true);
      expect(Array.isArray(mockHook.metadata.keywords)).toBe(true);
    });

    it('HookStats has required numeric fields', () => {
      expect(typeof mockHook.stats.installs).toBe('number');
      expect(typeof mockHook.stats.dailyActive).toBe('number');
      expect(typeof mockHook.stats.rating).toBe('number');
      expect(typeof mockHook.stats.reviews).toBe('number');
      expect(typeof mockHook.stats.views).toBe('number');
    });

    it('QualityMetrics has required boolean fields', () => {
      expect(typeof mockHook.quality.verified).toBe('boolean');
      expect(typeof mockHook.quality.communityChoice).toBe('boolean');
      expect(typeof mockHook.quality.securityAudited).toBe('boolean');
      expect(typeof mockHook.quality.documentationScore).toBe('number');
    });

    it('Author has required fields', () => {
      expect(mockHook.author).toHaveProperty('username');
      expect(mockHook.author).toHaveProperty('avatarUrl');
      expect(mockHook.author).toHaveProperty('isVerified');

      expect(typeof mockHook.author.username).toBe('string');
      expect(typeof mockHook.author.avatarUrl).toBe('string');
      expect(typeof mockHook.author.isVerified).toBe('boolean');
    });

    it('Compatibility has platforms array', () => {
      expect(Array.isArray(mockHook.compatibility.platforms)).toBe(true);
      expect(Array.isArray(mockHook.compatibility.dependencies)).toBe(true);
    });

    it('validates required vs optional fields', () => {
      // Required fields
      expect(mockHook.id).toBeDefined();
      expect(mockHook.name).toBeDefined();
      expect(mockHook.category).toBeDefined();
      expect(mockHook.description).toBeDefined();

      // Optional fields can be undefined
      const hookWithoutOptional: Hook = {
        ...mockHook,
        fullDescription: undefined,
        publishedAt: undefined,
        author: {
          ...mockHook.author,
          name: undefined,
          reputation: undefined
        }
      };

      expect(hookWithoutOptional.fullDescription).toBeUndefined();
      expect(hookWithoutOptional.publishedAt).toBeUndefined();
      expect(hookWithoutOptional.author.name).toBeUndefined();
    });
  });

  describe('Dependency Interface', () => {
    it('has required and optional fields', () => {
      const dep = mockHook.compatibility.dependencies[0];

      expect(dep).toHaveProperty('name');
      expect(dep).toHaveProperty('required');
      expect(typeof dep.name).toBe('string');
      expect(typeof dep.required).toBe('boolean');
    });
  });
});
