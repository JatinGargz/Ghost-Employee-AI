import { Evidence, EvidenceSource } from '../types/coral';

// Simulated database of enterprise knowledge documents
const ENTERPRISE_DOCUMENTS: Omit<Evidence, 'id' | 'score'>[] = [
  // GitHub Commits / PRs
  {
    source: 'GitHub',
    title: 'PR #412: Implement secure token rotation for OAuth flows',
    author: 'Sarah Connor',
    content: 'Refactored the OAuth authorization middleware to support automated token rotation. Stored refresh tokens inside Redis with TTL. Validated against the key-store service. Added fallback for public tokens.',
    url: 'https://github.com/enterprise/gateway/pull/412',
    timestamp: '2026-05-30T14:22:00Z',
  },
  {
    source: 'GitHub',
    title: 'Commit: Fix database migration deadlock in payment schema',
    author: 'Marcus Wright',
    content: 'Introduced advisory locks in pg-migration to prevent race conditions during heavy write surges. Managed retry delays with exponential backoff on transaction rollbacks. Tested against staging postgres.',
    url: 'https://github.com/enterprise/billing/commit/a8f092e',
    timestamp: '2026-05-29T09:15:00Z',
  },
  {
    source: 'GitHub',
    title: 'PR #389: Setup multi-stage build cache for Docker images',
    author: 'Sarah Connor',
    content: 'Configured Docker layer caching inside GitHub Actions workflows. Reduced container compilation times from 12 minutes to 2.4 minutes. Used twin builder paradigms with alpine-underlay layers.',
    url: 'https://github.com/enterprise/ops/pull/389',
    timestamp: '2026-05-28T18:40:00Z',
  },
  {
    source: 'GitHub',
    title: 'Commit: Refactor animated dashboard grid with motion layout',
    author: 'Elena Rostova',
    content: 'Integrated smooth motion layout transformations in the company metrics sidebar. Switched to lightweight spring settings to preserve battery and compute. Adjusted viewport bounding box updates.',
    url: 'https://github.com/enterprise/dashboard/commit/92cbb31',
    timestamp: '2026-05-30T11:05:00Z',
  },
  {
    source: 'GitHub',
    title: 'PR #422: Deploy expert-retrieval server controller',
    author: 'Apoorva Jha',
    content: 'Created server-side endpoint integration for generative query analysis. Injected API keys with appropriate back-off strategies. Set User-Agent headers.',
    url: 'https://github.com/enterprise/ai-core/pull/422',
    timestamp: '2026-05-31T01:10:00Z',
  },

  // Slack Interactions
  {
    source: 'Slack',
    title: '#help-ops: Database replication lag resolved',
    author: 'Sarah Connor',
    content: 'Hey team, the database migration yesterday caused a brief spike in replica lag because of a lock. I checked the pg_stat_activity and killed the hanging query on billing table. Replication is now synced!',
    url: 'https://slack.com/archives/C0911A/p1683229900',
    timestamp: '2026-05-29T10:02:00Z',
  },
  {
    source: 'Slack',
    title: '#engineering: Authentication middleware token questions',
    author: 'Thomas Anderson',
    content: 'We need to verify if the token rotation covers old sessions. Placed a quick security test on user session check and noticed pre-existing active keys persist for 10 min. Sarah, does the Redis token cache flush them instantly?',
    url: 'https://slack.com/archives/C1123B/p1683230482',
    timestamp: '2026-05-30T15:00:00Z',
  },
  {
    source: 'Slack',
    title: '#engineering: React State rendering flicker',
    author: 'Elena Rostova',
    content: 'Fixed the state infinite loop by removing the object dependencies from the useEffect array as advised! Always use primitive ids to trigger state updates instead of references. Grid is solid now.',
    url: 'https://slack.com/archives/C1123B/p1683231190',
    timestamp: '2026-05-31T00:45:00Z',
  },
  {
    source: 'Slack',
    title: '#ai-sandbox: Custom prompt engineering for reports',
    author: 'Apoorva Jha',
    content: 'Adding customized system instructions to our audit controller ensures our output is formatted exactly in clean Markdown before rendering. Highly recommend relying on responseSchema where applicable.',
    url: 'https://slack.com/archives/C9922D/p1683231650',
    timestamp: '2026-05-30T18:12:00Z',
  },

  // Jira Issues
  {
    source: 'Jira',
    title: 'BILL-441: Investigate transaction rollbacks in production gateway',
    author: 'Marcus Wright',
    content: 'Payment gateway keeps throwing deadlock errors during checkout peaks. Tracking shows parallel reads are trying to fetch customer accounts while migrations are locking rows. Switched locks to optimistic index checks.',
    url: 'https://jira.enterprise.com/browse/BILL-441',
    timestamp: '2026-05-28T16:30:00Z',
  },
  {
    source: 'Jira',
    title: 'SEC-109: Audit active JWT session token generation',
    author: 'Thomas Anderson',
    content: 'Need code verification on the token generation module. Confirmed signature verification is correctly using asymmetric RS256 with standard keyset rotated weekly. Sarah assisted with deployment of keys.',
    url: 'https://jira.enterprise.com/browse/SEC-109',
    timestamp: '2026-05-30T10:15:00Z',
  },
  {
    source: 'Jira',
    title: 'UI-890: Responsive grid layout glitches under low viewports',
    author: 'Elena Rostova',
    content: 'The custom grid breaks on mobile displays. Readjusted flex-grow behaviors and applied Tailwind sm: and md: prefix constraints. Verified touch interactions conform to the 44px min-tap recommendation.',
    url: 'https://jira.enterprise.com/browse/UI-890',
    timestamp: '2026-05-29T14:50:00Z',
  },

  // Notion Pages
  {
    source: 'Notion',
    title: 'Architecture Spec: Enterprise Prompt Controllers',
    author: 'Apoorva Jha',
    content: 'Defined standard specifications for utilizing advanced generative models on our server node. Outlined safety rules: keep API keys secret, run lazy initialized singletons, and structure system prompts to bypass model hallucinations.',
    url: 'https://notion.so/enterprise/ai-architecture-controllers',
    timestamp: '2026-05-29T11:20:00Z',
  },
  {
    source: 'Notion',
    title: 'Runbook: Database Migration & Backup Contingency',
    author: 'Marcus Wright',
    content: 'Official handbook for running migrations on Postgres. Step 1: Drain replica pools. Step 2: Acquire migration locks. Step 3: Run schema update. Step 4: Verify health checks. Rollback scripts are fully compiled inside /db/rollbacks.',
    url: 'https://notion.so/enterprise/db-migration-runbook',
    timestamp: '2026-05-27T13:10:00Z',
  },
  {
    source: 'Notion',
    title: 'Design System Checklist & Token Guide',
    author: 'Elena Rostova',
    content: 'Compendium of style guidelines. Emphasized light theme as default for accessibility (soft off-whites, deep charcoal grays). Discouraged custom styling sheets in favor of direct utility classes and Motion components.',
    url: 'https://notion.so/enterprise/design-system-guidelines',
    timestamp: '2026-05-28T15:15:00Z',
  },

  // Internal Documentation
  {
    source: 'Documentation',
    title: 'Security Architecture: Session Tokens & Auth Guard',
    author: 'Thomas Anderson',
    content: 'Full review of authorization guards. Requests are intercepted by Gateway Middleware. Token parsing looks for Bearer standard. Expiration is enforced at 1 hour. Blacklists are stored in Redis for instantaneous invalidation.',
    url: 'https://docs.enterprise.com/security/session-management',
    timestamp: '2026-05-25T09:00:00Z',
  },
  {
    source: 'Documentation',
    title: 'API Developer Reference Guide',
    author: 'Marcus Wright',
    content: 'Details standard guidelines for Express controller routing. Outlined error propagation, response formats, and route declarations. Server boots on port 3000 behind nginx reverse proxy.',
    url: 'https://docs.enterprise.com/api/express-conventions',
    timestamp: '2026-05-26T10:30:00Z',
  }
];

export class CoralService {
  /**
   * Simulates enterprise cognitive retrieval from multiple platforms using Coral RAG.
   * Leverages term matching, tf-idf concepts, and semantic heuristic weighting.
   */
  public static async retrieveEvidence(query: string): Promise<Evidence[]> {
    const cleanedQuery = query.toLowerCase().trim();
    if (!cleanedQuery) return [];

    // Extract search terms
    const queryTerms = cleanedQuery
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(term => term.length > 2);

    const scoredEvidences: Evidence[] = ENTERPRISE_DOCUMENTS.map((doc, idx) => {
      let score = 0;
      const textToSearch = `${doc.title} ${doc.author} ${doc.content} ${doc.source}`.toLowerCase();

      // Heuristic matches
      queryTerms.forEach(term => {
        // Precise match gets higher boost
        const regex = new RegExp(`\\b${term}\\b`, 'g');
        const matches = textToSearch.match(regex);
        if (matches) {
          score += matches.length * 3;
        }

        // Substring match gets normal increment
        if (textToSearch.includes(term) && !matches) {
          score += 1.5;
        }
      });

      // Boost specific source filters if mentioned
      const sourceKeywords: Record<string, EvidenceSource> = {
        github: 'GitHub',
        slack: 'Slack',
        jira: 'Jira',
        notion: 'Notion',
        documentation: 'Documentation',
        docs: 'Documentation',
      };

      Object.entries(sourceKeywords).forEach(([key, source]) => {
        if (cleanedQuery.includes(key) && doc.source === source) {
          score += 5; // Direct filter match
        }
      });

      // Boost recent files slightly to favor fresh data
      const docAgeDays = (Date.now() - new Date(doc.timestamp).getTime()) / (1000 * 3600 * 24);
      if (docAgeDays < 2) {
        score += 2;
      }

      return {
        ...doc,
        id: `ev-${idx + 1}`,
        score: Math.round(score * 10) / 10,
      };
    });

    // Filter out irrelevant or zero-matching documents and sort by score desc
    return scoredEvidences
      .filter(ev => (ev.score || 0) > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      // Return top 6 items
      .slice(0, 6);
  }

  /**
   * Retrieves enterprise digital footprint analytics for anomaly/ghost detection.
   * Tallies the actual digital actions for each listed employee.
   */
  public static getEmployeeFootprints(): Record<string, Record<string, number>> {
    const footprints: Record<string, Record<string, number>> = {
      'Sarah Connor': { GitHub: 2, Slack: 1, Jira: 0, Notion: 0, Documentation: 0 },
      'Marcus Wright': { GitHub: 1, Slack: 0, Jira: 1, Notion: 1, Documentation: 1 },
      'Elena Rostova': { GitHub: 1, Slack: 1, Jira: 1, Notion: 1, Documentation: 0 },
      'Thomas Anderson': { GitHub: 0, Slack: 1, Jira: 1, Notion: 0, Documentation: 1 },
      'Apoorva Jha': { GitHub: 1, Slack: 1, Jira: 0, Notion: 1, Documentation: 0 },
      // Note Donald Vance has ZERO digital activity! He is the Ghost Employee on payroll.
      'Donald Vance': { GitHub: 0, Slack: 0, Jira: 0, Notion: 0, Documentation: 0 },
    };

    ENTERPRISE_DOCUMENTS.forEach(doc => {
      if (footprints[doc.author]) {
        footprints[doc.author][doc.source] = (footprints[doc.author][doc.source] || 0) + 1;
      }
    });

    return footprints;
  }
}
