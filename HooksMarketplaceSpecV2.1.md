# Cloud Code Hooks Marketplace - Web Application Specification v2.1

## 1. Overview
A comprehensive marketplace for discovering and sharing Cloud Code hooks that enhance developer workflows. The platform showcases community-created hooks with a card-based interface optimized for browsing and discovery.

**Key Improvements in v2.1:**
- Enhanced security and authentication details
- Comprehensive API specification
- Testing and quality assurance strategy
- Accessibility standards (WCAG 2.1 AA)
- Community guidelines and legal framework
- Analytics and monitoring infrastructure

## 2. Hook Types & Categories

### Core Hook Types
- **PreToolUse**: Validate/modify before tool execution (Bash, Write, Edit, Read, etc.)
- **PostToolUse**: Actions after tool completion
- **UserPromptSubmit**: Intercept/enhance user prompts
- **Notification**: Handle system notifications
- **Stop/SubagentStop**: Cleanup when Claude finishes
- **AfterGeneration**: Process generated code/content
- **BeforeCommit**: Pre-commit validations
- **AfterCommit**: Post-commit actions
- **OnError**: Error handling and recovery
- **OnFileChange**: File modification triggers
- **CustomWebhook**: External service integrations

### Hook Categories
- 🛡️ Security & Validation
- 🎨 Code Formatting & Linting
- 📊 Analytics & Monitoring
- 🔄 Git & Version Control
- 🧪 Testing & QA
- 📝 Documentation Generation
- 🚀 Deployment & CI/CD
- 🔧 Development Tools
- 💾 Backup & Recovery
- 🌐 API Integrations

## 3. Homepage Design

### Layout Structure
```
┌─────────────────────────────────────────────┐
│            SEARCH BAR & FILTERS             │
├─────────────────────────────────────────────┤
│ Quick Filters: [All] [PreTool] [PostTool]  │
│               [Security] [Format] [Git]     │
├─────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│ │Card │ │Card │ │Card │ │Card │ │Card │  │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│ │Card │ │Card │ │Card │ │Card │ │Card │  │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│ │Card │ │Card │ │Card │ │Card │ │Card │  │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│                Load More...                 │
└─────────────────────────────────────────────┘
```

### Card Display
- **Grid Layout**: 5 cards per row (desktop), 3 (tablet), 1 (mobile)
- **Infinite Scroll**: Load 30 cards initially, then lazy load
- **Density**: Compact cards to show maximum hooks
- **Hover Effects**: Expand card slightly with more details
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select
- **Screen Reader**: Semantic HTML with ARIA labels

## 4. Hook Card Design

### Compact View (Default)
```
┌──────────────────────────┐
│ [PreToolUse] 🛡️         │
│ bash-validator           │
│ by @username    ⭐ 234   │
│ ─────────────────────    │
│ Validates bash commands  │
│ before execution         │
│ [security] [validation]  │
└──────────────────────────┘
```

### Expanded View (On Hover)
```
┌──────────────────────────┐
│ [PreToolUse] 🛡️         │
│ bash-validator           │
│ by @username    ⭐ 234   │
│ 📥 1.2k installs         │
│ ─────────────────────    │
│ Validates bash commands  │
│ before execution to      │
│ prevent dangerous ops    │
│                          │
│ ✓ Blocks rm -rf /       │
│ ✓ Validates permissions │
│ ✓ Custom rules          │
│ [security] [validation]  │
│ [View Details] [Install] │
└──────────────────────────┘
```

## 5. Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Radix UI
- **State**: Zustand for filters/search
- **Data Fetching**: TanStack Query
- **Search**: Algolia or MeiliSearch
- **Analytics**: PostHog
- **Forms**: React Hook Form + Zod validation
- **Theme**: next-themes for dark mode
- **i18n**: next-intl for internationalization

### Backend Services
- **API**: Node.js + Fastify
- **Database**: PostgreSQL + Prisma
- **Cache**: Redis for GitHub data
- **Queue**: Bull for background jobs
- **Storage**: S3 for cached READMEs
- **CDN**: CloudFlare for static assets
- **Feature Flags**: LaunchDarkly

### GitHub Integration
- **Webhook Events**:
  - `push`: Update hook metadata from README
  - `release`: Publish new version
  - `star`: Update popularity metrics
  - `fork`: Track community engagement
  - `issues`: Sync support tickets

- **Sync Strategy**:
  - **Initial**: Fetch all data via GraphQL (batch 100 repos)
  - **Updates**: Webhook-driven incremental updates
  - **Fallback**: Hourly cron for missed webhooks
  - **Cache TTL**: 1 hour for metadata, 24h for READMEs
  - **Rate Limiting**: 5000 req/hour (GitHub API limit)

- **GraphQL Queries**:
  ```graphql
  query GetHookRepos($cursor: String) {
    search(
      query: "topic:claude-code-hook"
      type: REPOSITORY
      first: 100
      after: $cursor
    ) {
      nodes {
        ... on Repository {
          name
          description
          stargazerCount
          forkCount
          issues { totalCount }
          releases(first: 1) {
            nodes { tagName }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ```

### Observability
- **Logging**: Structured logs with Pino
- **Error Tracking**: Sentry for client and server errors
- **Monitoring**: DataDog for metrics and APM
- **Alerting**: PagerDuty for critical failures
- **Uptime**: UptimeRobot for endpoint health checks
- **Tracing**: OpenTelemetry for distributed tracing

## 6. Core Features

### Discovery & Search
- **Smart Search**: Full-text with typo tolerance
- **Multi-filter**: Combine hook type + category + tags
- **Sort Options**: Popular, Recent, Trending, Most Used
- **Quick Actions**: Copy install command, star, share
- **Saved Searches**: Bookmark filter combinations
- **Search History**: Recent searches with quick access

### Hook Details Page
- **Live Preview**: Interactive config builder
- **Usage Examples**: Real-world scenarios
- **Compatibility Matrix**: Claude Code versions
- **Dependencies**: Required tools/setup
- **Performance Impact**: Overhead metrics
- **Community**: Comments, issues, Q&A
- **Changelog**: Version history
- **Related Hooks**: Similar or complementary hooks

### Developer Experience
- **One-Click Install**: Copy config snippet
- **Hook Composer**: Combine multiple hooks
- **Testing Playground**: Try before installing
- **Version Management**: Pin specific versions
- **Conflict Detection**: Check compatibility
- **Rollback Support**: Undo installations
- **Export/Import**: Backup hook configurations

## 7. Data Models

### Enhanced Hook Entity
```typescript
interface Hook {
  id: string;
  github: {
    url: string;
    owner: string;
    repo: string;
    stars: number;
    forks: number;
    issues: number;
    lastSync: Date;
  };
  metadata: {
    name: string;
    description: string;
    version: string;
    hookTypes: HookType[];
    matchers: string[];
    category: Category;
    tags: string[];
    license: string; // MIT, Apache-2.0, etc.
    keywords: string[];
  };
  stats: {
    installs: number;
    dailyActive: number;
    rating: number;
    reviews: number;
    views: number;
  };
  compatibility: {
    minVersion: string;
    maxVersion: string;
    platforms: Platform[];
    dependencies: Dependency[];
  };
  config: {
    examples: ConfigExample[];
    defaults: object;
    schema: JSONSchema;
  };
  quality: {
    verified: boolean;
    communityChoice: boolean;
    securityAudited: boolean;
    performanceTested: boolean;
    documentationScore: number; // 0-100
  };
  author: {
    id: string;
    username: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

interface User {
  id: string;
  github: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatarUrl: string;
    profileUrl: string;
    accessToken: string; // encrypted
    refreshToken: string; // encrypted
  };
  roles: Role[];
  permissions: Permission[];
  submissions: Hook[];
  favorites: string[]; // hook IDs
  installations: Installation[];
  reviews: Review[];
  isVerified: boolean;
  reputation: number;
  createdAt: Date;
  lastLoginAt: Date;
}

interface Role {
  name: 'user' | 'author' | 'moderator' | 'admin';
  permissions: Permission[];
}

interface Permission {
  resource: 'hook' | 'user' | 'review' | 'comment';
  actions: ('create' | 'read' | 'update' | 'delete' | 'moderate')[];
}

interface Installation {
  hookId: string;
  userId: string;
  version: string;
  config: object;
  installedAt: Date;
  lastUsed: Date;
  usageCount: number;
}

interface Review {
  id: string;
  hookId: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  helpful: number;
  version: string; // hook version reviewed
  createdAt: Date;
  updatedAt: Date;
}

interface Dependency {
  name: string;
  version: string;
  type: 'tool' | 'library' | 'service';
  required: boolean;
  installCmd: string;
}
```

## 8. Submission & Quality Assurance

### Automated Validation Pipeline

**1. Repository Structure Check**
```typescript
const REQUIRED_FILES = [
  'README.md',
  'hook.json',
  'LICENSE'
];

const OPTIONAL_FILES = [
  'CHANGELOG.md',
  'examples/',
  'tests/'
];
```

**2. Config Schema Validation**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "version", "hookType", "command"],
  "properties": {
    "name": { "type": "string", "minLength": 3, "maxLength": 50 },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "hookType": { "enum": ["PreToolUse", "PostToolUse", "..."] },
    "command": { "type": "string" },
    "matcher": { "type": "string" }
  }
}
```

**3. Security Scan**
- Detect hardcoded secrets using regex patterns:
  - API keys: `[A-Za-z0-9]{32,}`
  - AWS keys: `AKIA[0-9A-Z]{16}`
  - GitHub tokens: `ghp_[a-zA-Z0-9]{36}`
- Check for suspicious shell commands:
  - `rm -rf /`, `dd if=/dev/zero`, `:(){ :|:& };:`
  - Unvalidated user input in `eval`, `exec`
- Validate external URLs (must use HTTPS)
- Scan dependencies for known vulnerabilities (npm audit)

**4. Performance Test**
- Max execution time: 5s
- Memory limit: 100MB
- File size limit: 1MB
- CPU usage monitoring
- Network call limits

**5. Documentation Score (0-100)**
```typescript
const calculateDocScore = (readme: string) => {
  let score = 0;
  if (readme.length >= 500) score += 20;
  if (readme.includes('## Installation')) score += 20;
  if (readme.includes('## Usage')) score += 20;
  if (readme.includes('## Examples')) score += 20;
  if (readme.includes('## Configuration')) score += 10;
  if (readme.includes('## Troubleshooting')) score += 10;
  return score;
};
```

### Quality Indicators
- ✅ **Verified Author**: GitHub account age > 1 year, 100+ followers
- 🏆 **Community Choice**: Top 10% in category by installs + rating
- 🔒 **Security Audited**: Passed automated + manual security review
- ⚡ **Performance Tested**: Benchmarked with <100ms overhead
- 📚 **Well Documented**: Documentation score ≥ 80

### Manual Review Process
1. **Auto-Approve**: Score ≥ 80, no security issues
2. **Queue for Review**: Score 60-79 or minor warnings
3. **Reject**: Score < 60 or critical security issues
4. **Review SLA**: 48 hours for manual reviews

## 9. Security & Authentication

### OAuth Flow (GitHub SSO)
```
User → Click "Login with GitHub"
  ↓
Redirect to GitHub OAuth
  ↓
User Authorizes App
  ↓
Callback with code → Exchange for access token
  ↓
Fetch user profile → Create/update user record
  ↓
Generate JWT tokens → Set HTTP-only cookies
  ↓
Redirect to dashboard
```

### Session Management
- **Access Token**: 15 minutes expiry (JWT)
- **Refresh Token**: 7 days expiry (JWT)
- **Storage**: HTTP-only, Secure, SameSite=Strict cookies
- **Token Rotation**: Refresh token rotated on each use
- **Revocation**: Support manual logout and token invalidation

### Rate Limiting
```typescript
const rateLimits = {
  anonymous: {
    search: '20/min',
    view: '100/min',
  },
  authenticated: {
    search: '100/min',
    view: '500/min',
    submit: '10/hour',
    review: '30/hour',
  },
  admin: {
    all: '1000/min',
  },
};
```

### Content Security Policy
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://avatars.githubusercontent.com;
  connect-src 'self' https://api.github.com;
  frame-ancestors 'none';
```

### Data Privacy (GDPR Compliance)
- **Data Export**: Users can download all their data (JSON format)
- **Data Deletion**: Right to be forgotten (anonymize reviews, delete account)
- **Cookie Consent**: Banner with granular controls (essential, analytics, marketing)
- **Privacy Policy**: Clear disclosure of data collection and usage
- **Data Retention**: Delete inactive accounts after 2 years

## 10. API Endpoints

### Public Endpoints

**GET /api/hooks**
```typescript
// Query params
interface HooksQuery {
  category?: string;
  type?: HookType;
  tags?: string[];
  search?: string;
  sort?: 'popular' | 'recent' | 'trending' | 'mostUsed';
  page?: number;
  limit?: number; // max 100
}

// Response
interface HooksResponse {
  data: Hook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  meta: {
    requestId: string;
    timestamp: string;
    duration: number; // ms
  };
}
```

**GET /api/hooks/:id**
```typescript
interface HookDetailResponse {
  data: Hook;
  related: Hook[]; // max 6
  meta: {
    requestId: string;
    timestamp: string;
  };
}
```

**GET /api/hooks/:id/stats**
```typescript
interface HookStatsResponse {
  data: {
    views: TimeSeriesData;
    installs: TimeSeriesData;
    rating: number;
    reviews: Review[];
  };
}
```

**GET /api/categories**
```typescript
interface CategoriesResponse {
  data: {
    name: string;
    icon: string;
    count: number;
  }[];
}
```

**GET /api/search**
```typescript
interface SearchQuery {
  q: string;
  type?: HookType;
  category?: string;
  limit?: number;
}

interface SearchResponse {
  data: Hook[];
  suggestions: string[];
  facets: {
    types: { name: string; count: number }[];
    categories: { name: string; count: number }[];
  };
}
```

### Authenticated Endpoints

**POST /api/hooks**
```typescript
interface CreateHookRequest {
  githubUrl: string;
  category: string;
  tags: string[];
}

interface CreateHookResponse {
  data: Hook;
  validation: {
    score: number;
    warnings: string[];
    errors: string[];
  };
}
```

**PATCH /api/hooks/:id**
```typescript
interface UpdateHookRequest {
  category?: string;
  tags?: string[];
  metadata?: Partial<Hook['metadata']>;
}
```

**DELETE /api/hooks/:id**
```typescript
// Soft delete, returns 204 No Content
```

**POST /api/hooks/:id/star**
```typescript
interface StarResponse {
  data: {
    starred: boolean;
    totalStars: number;
  };
}
```

**POST /api/hooks/:id/reviews**
```typescript
interface CreateReviewRequest {
  rating: number; // 1-5
  title: string;
  content: string;
  version: string;
}

interface CreateReviewResponse {
  data: Review;
}
```

**GET /api/user/installations**
```typescript
interface InstallationsResponse {
  data: Installation[];
}
```

**POST /api/user/installations**
```typescript
interface InstallRequest {
  hookId: string;
  version: string;
  config?: object;
}
```

### Admin Endpoints

**POST /api/admin/hooks/:id/verify**
```typescript
// Mark hook as verified
```

**POST /api/admin/hooks/:id/audit**
```typescript
// Trigger security audit
```

**DELETE /api/admin/users/:id**
```typescript
// Ban user
```

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: object;
    path?: string;
    timestamp: string;
    requestId: string;
  };
}

// Example error codes
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};
```

## 11. Testing Strategy

### Unit Tests (Jest + Testing Library)
```typescript
// Target: 80% code coverage

describe('HookCard Component', () => {
  it('renders compact view by default', () => {});
  it('expands on hover', () => {});
  it('handles keyboard navigation', () => {});
  it('announces changes to screen readers', () => {});
});

describe('Hook Validation', () => {
  it('rejects invalid config schema', () => {});
  it('detects hardcoded secrets', () => {});
  it('validates GitHub URL format', () => {});
});

describe('Search Filtering', () => {
  it('filters by category', () => {});
  it('combines multiple filters', () => {});
  it('handles typos with fuzzy search', () => {});
});
```

### Integration Tests (Playwright)
```typescript
test('End-to-end user flow', async ({ page }) => {
  // 1. Search for hooks
  await page.goto('/');
  await page.fill('[data-testid="search"]', 'bash');
  await page.click('[data-testid="search-button"]');

  // 2. View hook details
  await page.click('text=bash-validator');
  await expect(page).toHaveURL(/\/hooks\/bash-validator/);

  // 3. Install hook
  await page.click('[data-testid="install-button"]');
  await expect(page.locator('[data-testid="copy-success"]')).toBeVisible();
});

test('GitHub OAuth flow', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Login with GitHub');
  // Mock GitHub OAuth callback
  await page.goto('/auth/callback?code=mock_code');
  await expect(page).toHaveURL('/dashboard');
});

test('Hook submission workflow', async ({ page }) => {
  // Login required
  await loginAsUser(page);

  // Submit new hook
  await page.goto('/submit');
  await page.fill('[name="githubUrl"]', 'https://github.com/user/hook');
  await page.selectOption('[name="category"]', 'security');
  await page.click('[type="submit"]');

  // Wait for validation
  await expect(page.locator('text=Validation passed')).toBeVisible();
});
```

### Performance Tests (k6)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 1000 }, // Load test
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests < 200ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function() {
  const res = http.get('https://hooks.example.com/api/hooks?limit=30');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

### Lighthouse Performance Targets
```json
{
  "performance": 90,
  "accessibility": 100,
  "best-practices": 95,
  "seo": 100,
  "pwa": 80
}
```

## 12. Accessibility Standards (WCAG 2.1 AA)

### Keyboard Navigation
- **Tab Order**: Logical flow through all interactive elements
- **Focus Indicators**: Visible 2px outline with 4.5:1 contrast
- **Skip Links**: "Skip to main content" for screen readers
- **Keyboard Shortcuts**:
  - `/` - Focus search
  - `Esc` - Close modals
  - `Arrow keys` - Navigate cards
  - `Enter` - Select/activate
  - `?` - Show keyboard shortcuts help

### Screen Reader Support
```jsx
// Example: Hook Card with ARIA labels
<article
  role="article"
  aria-labelledby="hook-title-123"
  aria-describedby="hook-desc-123"
>
  <h3 id="hook-title-123">bash-validator</h3>
  <p id="hook-desc-123">Validates bash commands before execution</p>
  <button
    aria-label="Install bash-validator hook"
    onClick={handleInstall}
  >
    Install
  </button>
</article>
```

### Visual Design
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Management**: Trap focus in modals, restore on close
- **Text Resize**: Support up to 200% zoom without layout breaking
- **Motion**: Respect `prefers-reduced-motion` media query
- **Dark Mode**: Full support with proper contrast ratios

### Forms
- **Labels**: All inputs have associated labels
- **Errors**: Announced to screen readers with `role="alert"`
- **Required Fields**: Marked with `aria-required="true"`
- **Help Text**: Connected with `aria-describedby`

### Testing Tools
- **axe DevTools**: Automated accessibility scanning
- **NVDA/JAWS**: Screen reader testing
- **Keyboard Only**: Navigate entire site without mouse
- **Color Blindness**: Test with color filters

## 13. Community Guidelines

### Code of Conduct
1. **Be Respectful**: Treat all community members with dignity
2. **Be Constructive**: Provide helpful feedback, not criticism
3. **Be Inclusive**: Welcome developers of all skill levels
4. **Be Professional**: No harassment, discrimination, or abuse

### Contribution Guidelines

**Hook Naming Conventions:**
- Use kebab-case: `bash-validator`, `prettier-format`
- Be descriptive: `git-commit-lint` not `gcl`
- Avoid generic names: `security-scanner` not `scanner`

**Documentation Templates:**
```markdown
# Hook Name

## Description
Brief overview of what the hook does.

## Installation
```bash
# Copy to .claude/settings.json
```

## Configuration
Explain available options.

## Examples
Real-world usage scenarios.

## Troubleshooting
Common issues and solutions.

## Contributing
How to report bugs or contribute.

## License
MIT / Apache 2.0
```

**Issue Reporting Process:**
1. Check existing issues for duplicates
2. Use issue templates (bug report, feature request)
3. Provide minimal reproducible example
4. Include environment details (OS, Claude version)

**Pull Request Guidelines:**
1. One feature/fix per PR
2. Update documentation if needed
3. Add tests for new features
4. Follow existing code style
5. Squash commits before merging

### Author Verification
To get verified author badge:
- GitHub account age > 1 year
- At least 1 published hook with 100+ installs
- No security violations or policy violations
- Active in community (reviews, discussions)

## 14. Legal & Compliance

### Terms of Service
- **User Conduct**: Prohibited activities (spam, malware, abuse)
- **Content Ownership**: Authors retain rights to their hooks
- **Platform Rights**: Right to remove content violating ToS
- **Disclaimer**: No warranty, use at your own risk
- **Termination**: Account suspension/ban process

### Privacy Policy
**Data Collection:**
- Account info (GitHub profile, email)
- Usage analytics (page views, searches, installs)
- Technical logs (IP address, browser, errors)

**Data Usage:**
- Improve platform features
- Security and fraud prevention
- Marketing communications (opt-in)

**Data Sharing:**
- No selling of user data
- Third-party services (GitHub, analytics) per their policies
- Legal requirements only

**User Rights:**
- Access your data
- Export your data
- Delete your account
- Opt-out of analytics

### DMCA Takedown Process
1. Submit notice to dmca@example.com
2. Include: copyrighted work, infringing URL, contact info
3. Review within 24 hours
4. Notify author and allow counter-notice (10 days)
5. Remove content or restore per legal requirements

### Data Retention Policies
- **Active accounts**: Retained indefinitely
- **Inactive accounts**: Deleted after 2 years of inactivity
- **Deleted hooks**: Soft delete for 30 days, then permanent
- **Analytics**: Aggregated data retained for 5 years
- **Logs**: Security logs retained for 90 days

### Cookie Consent Management
```typescript
interface CookiePreferences {
  essential: true; // Always enabled
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}
```

**Cookie Categories:**
- **Essential**: Authentication, security (no consent needed)
- **Analytics**: PostHog, Google Analytics (opt-in)
- **Marketing**: Ad tracking (opt-in)
- **Preferences**: Theme, language (opt-in)

## 15. Analytics & Metrics

### Real-Time Dashboard
```
┌─────────────────────────────────────────┐
│  Active Users: 1,234                    │
│  Hooks Online: 567                      │
│  Installs Today: 89                     │
├─────────────────────────────────────────┤
│  📈 Installs (Last 7 Days)              │
│  ▁▂▃▅▇█▇▅                               │
├─────────────────────────────────────────┤
│  🔥 Trending Hooks                      │
│  1. bash-validator (+45%)               │
│  2. prettier-format (+32%)              │
│  3. git-commit-lint (+28%)              │
├─────────────────────────────────────────┤
│  🌍 Geographic Distribution             │
│  USA: 35% | EU: 28% | Asia: 25%        │
└─────────────────────────────────────────┘
```

### Key Metrics

**Platform Health:**
- Total hooks published
- Active hooks (used in last 30 days)
- Total users (registered + anonymous)
- Daily/Weekly/Monthly active users

**Engagement Metrics:**
- Average time on site
- Pages per session
- Bounce rate
- Search-to-install conversion rate

**Hook Performance:**
- Top 10 hooks by category
- Average rating by category
- Install velocity (installs per day since publish)
- Retention rate (still installed after 30 days)

**Community Metrics:**
- New authors per month
- Reviews submitted
- Average response time to issues
- GitHub stars/forks trend

### Conversion Funnel
```
100% Landing Page Views
  ↓ 65% Search
  ↓ 45% View Hook Details
  ↓ 25% Click Install
  ↓ 15% Copy Config
  ↓ 10% Return Users (installed successfully)
```

### A/B Testing Strategy
- **Search Algorithm**: Compare relevance algorithms
- **Card Layout**: Test compact vs expanded default
- **CTA Buttons**: "Install" vs "Get Started" vs "Try Now"
- **Pricing**: Test premium features (if applicable)

### Attribution Tracking
```typescript
// Track where traffic comes from
interface Attribution {
  source: 'github' | 'twitter' | 'direct' | 'search' | 'other';
  medium: 'social' | 'organic' | 'referral' | 'email';
  campaign?: string;
  content?: string;
}
```

## 16. MVP Implementation Plan

### Phase 1: Core Platform (Week 1-2)
**Week 1:**
- [ ] Setup Next.js project with TypeScript + Tailwind
- [ ] Configure PostgreSQL + Prisma
- [ ] Implement GitHub OAuth flow
- [ ] Create base layout with header/footer
- [ ] Setup error tracking (Sentry)

**Week 2:**
- [ ] Implement hook card components
- [ ] Create grid layout with responsive breakpoints
- [ ] Add basic search functionality
- [ ] Implement GitHub data sync (initial fetch)
- [ ] Deploy to Vercel staging

### Phase 2: Enhanced Discovery (Week 3-4)
**Week 3:**
- [ ] Add advanced filtering UI (category, type, tags)
- [ ] Implement infinite scroll with TanStack Query
- [ ] Create hook detail pages
- [ ] Add installation code snippets with copy button
- [ ] Setup analytics (PostHog)

**Week 4:**
- [ ] Implement search with Algolia/MeiliSearch
- [ ] Add sorting options (popular, recent, trending)
- [ ] Create category landing pages
- [ ] Add related hooks section
- [ ] Deploy to production

### Phase 3: Quality & Testing (Week 5-6)
**Week 5:**
- [ ] Implement automated validation pipeline
- [ ] Add security scanning for submissions
- [ ] Create documentation score calculator
- [ ] Add performance benchmarking
- [ ] Setup rate limiting

**Week 6:**
- [ ] Write unit tests (target 80% coverage)
- [ ] Create integration tests (Playwright)
- [ ] Run performance tests (k6)
- [ ] Accessibility audit (axe, manual testing)
- [ ] Bug fixes and optimization

### Phase 4: Community Features (Week 7-8)
**Week 7:**
- [ ] Implement hook submission flow
- [ ] Add rating and review system
- [ ] Create comment threads
- [ ] Build author profile pages
- [ ] Add email notifications

**Week 8:**
- [ ] Implement moderation tools (admin panel)
- [ ] Add content reporting system
- [ ] Create user dashboard (my hooks, favorites)
- [ ] Add hook analytics for authors
- [ ] Launch marketing campaign

### Post-Launch Roadmap
**Month 2:**
- Hook versioning and changelog
- Dependency conflict detection
- Hook collections/bundles
- Browser extension for one-click install

**Month 3:**
- Premium features (analytics, priority support)
- API for programmatic access
- CLI tool for hook management
- Mobile app (React Native)

**Month 4:**
- AI-powered hook recommendations
- Automated security audits with AI
- Hook marketplace API
- Enterprise features (private hooks, SSO)

## 17. Success Metrics

### North Star Metric
**Monthly Active Hook Installations**: Target 10,000 by month 3

### Launch Targets (Month 1)
- [ ] 50+ quality hooks published
- [ ] 500+ registered users
- [ ] 1,000+ hook installations
- [ ] < 2s average page load time
- [ ] 100/100 Lighthouse accessibility score

### Growth Targets (Month 3)
- [ ] 200+ hooks published
- [ ] 5,000+ registered users
- [ ] 10,000+ monthly active installations
- [ ] 50+ active authors
- [ ] 4.5+ average hook rating

### Retention Targets
- **Day 1**: 40% of installers return
- **Day 7**: 25% still using installed hooks
- **Day 30**: 15% retention (active installations)

### Community Health
- **Response Time**: < 24h median for issues/questions
- **Author Retention**: 60% publish second hook
- **Review Rate**: 20% of installations result in review
- **Helpful Reviews**: 70%+ marked as helpful

## 18. Infrastructure & Deployment

### Architecture Diagram
```
┌──────────────┐
│   CloudFlare │ (CDN, DDoS protection)
└──────┬───────┘
       │
┌──────▼───────┐
│   Vercel     │ (Next.js frontend)
└──────┬───────┘
       │
       ├─────────┐
       │         │
┌──────▼────┐  ┌▼──────────┐
│  Fastify  │  │  Postgres │
│  API      │  │  (Supabase)│
└──────┬────┘  └───────────┘
       │
       ├────────┬──────────┬──────────┐
       │        │          │          │
┌──────▼──┐  ┌─▼────┐  ┌─▼────┐  ┌─▼────┐
│  Redis  │  │ Bull │  │  S3  │  │Sentry│
│ (Cache) │  │(Jobs)│  │(Stor)│  │(Err) │
└─────────┘  └──────┘  └──────┘  └──────┘
```

### Cost Estimates (Monthly)
```
Vercel Pro:            $20
Supabase Pro:          $25
Redis (Upstash):       $10
Algolia:               $0 (free tier, then $1/1k searches)
PostHog:               $0 (self-hosted)
Sentry:                $26 (team plan)
CloudFlare:            $20
S3 Storage:            $5
Domain:                $2
─────────────────────────
Total:                ~$108/month
```

### Scaling Strategy
- **Database**: Read replicas for analytics queries
- **Cache**: Redis cluster for high availability
- **CDN**: Edge caching for static assets
- **API**: Horizontal scaling with load balancer
- **Queue**: Multiple Bull workers for background jobs

## 19. Risk Mitigation

### Security Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|------------|
| Malicious hooks | High | Critical | Automated scanning + manual review |
| XSS attacks | Medium | High | CSP headers + input sanitization |
| DDoS | Medium | High | CloudFlare protection + rate limiting |
| Data breach | Low | Critical | Encryption at rest/transit + audits |

### Business Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|------------|
| Low adoption | Medium | High | Marketing, seeding with quality hooks |
| GitHub API limits | High | Medium | Caching + webhook sync strategy |
| Spam submissions | High | Medium | CAPTCHA + author reputation system |
| Legal issues | Low | Critical | Clear ToS, DMCA process, insurance |

### Technical Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|------------|
| Database performance | Medium | High | Indexing, query optimization, caching |
| Search downtime | Low | Medium | Fallback to database search |
| Build failures | Low | Low | CI/CD with rollback capability |

## Appendix

### Glossary
- **Hook**: Script that runs at specific Claude Code lifecycle events
- **Matcher**: Pattern to filter which tool executions trigger a hook
- **Hook Type**: Category of lifecycle event (PreToolUse, PostToolUse, etc.)
- **Installation**: User-specific configuration of a hook
- **Verification**: Manual quality review for trusted authors

### References
- [Claude Code Documentation](https://code.claude.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)

### Change Log

**v2.1 (2026-02-02)**
- Added comprehensive security and authentication details
- Specified complete API endpoint contracts
- Added testing strategy with coverage targets
- Included accessibility standards (WCAG 2.1 AA)
- Added community guidelines and legal framework
- Added analytics and monitoring infrastructure
- Enhanced data models with User and Permission types
- Added risk mitigation matrix
- Added infrastructure and cost estimates

**v2.0 (2026-02-01)**
- Initial specification
- Core features and architecture
- Basic implementation plan
