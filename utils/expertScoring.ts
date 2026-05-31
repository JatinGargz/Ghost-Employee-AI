import { Evidence, ExpertScore } from '../types/coral';

/**
 * Calculates a composite score for each contributor based on retrieved evidence.
 * Integrates document relevance (evidence.score) alongside platform authority weighting.
 */
export function calculateExpertScores(evidences: Evidence[]): ExpertScore[] {
  const authorScores: Record<string, {
    scoreSum: number;
    matchCount: number;
    breakdown: Record<string, number>;
    reasons: string[];
  }> = {};

  // Initialize authors we encounter or know
  const defaultPlatforms = { GitHub: 0, Slack: 0, Jira: 0, Notion: 0, Documentation: 0 };

  evidences.forEach(ev => {
    const author = ev.author;
    if (!author) return;

    if (!authorScores[author]) {
      authorScores[author] = {
        scoreSum: 0,
        matchCount: 0,
        breakdown: { ...defaultPlatforms },
        reasons: [],
      };
    }

    const record = authorScores[author];
    const docScore = ev.score || 1.0;

    // Weight authority by enterprise channels
    let platformWeight = 1.0;
    switch (ev.source) {
      case 'GitHub':
        platformWeight = 1.6; // Deep software construction
        break;
      case 'Documentation':
        platformWeight = 1.4; // Standards and review
        break;
      case 'Jira':
        platformWeight = 1.2; // Tactical task ownership
        break;
      case 'Notion':
        platformWeight = 1.1; // Architectural descriptions
        break;
      case 'Slack':
        platformWeight = 0.9; // Fast-moving conversations
        break;
    }

    const earnedScore = Math.round(docScore * platformWeight * 10) / 10;
    record.scoreSum += earnedScore;
    record.matchCount += 1;
    record.breakdown[ev.source] = (record.breakdown[ev.source] || 0) + earnedScore;

    // Build context-specific reasons
    let platformAction = 'contributed';
    if (ev.source === 'GitHub') platformAction = 'authored code regarding';
    else if (ev.source === 'Slack') platformAction = 'discussed in a chat regarding';
    else if (ev.source === 'Jira') platformAction = 'resolved ticket for';
    else if (ev.source === 'Notion') platformAction = 'wrote spec for';
    else if (ev.source === 'Documentation') platformAction = 'maintained official documentation about';

    record.reasons.push(`${platformAction} "${ev.title.replace(/^(PR #\d+|Commit:|BILL-\d+:)\s*/, '')}"`);
  });

  // Convert the aggregated items to custom ExpertScore layout
  const rankedExperts: ExpertScore[] = Object.entries(authorScores).map(([name, data]) => {
    return {
      name,
      score: Math.round(data.scoreSum * 10) / 10,
      matchCount: data.matchCount,
      breakdown: {
        GitHub: Math.round(data.breakdown.GitHub * 10) / 10,
        Slack: Math.round(data.breakdown.Slack * 10) / 10,
        Jira: Math.round(data.breakdown.Jira * 10) / 10,
        Notion: Math.round(data.breakdown.Notion * 10) / 10,
        Documentation: Math.round(data.breakdown.Documentation * 10) / 10,
      },
      reasons: data.reasons.slice(0, 3) // Return top 3 representative reasons
    };
  });

  // Sort by overall score desc
  return rankedExperts.sort((a, b) => b.score - a.score);
}
