import { Activity, CoralDocument, Employee, SearchResult, ExpertRankingResult } from '../types/coral';
import { HARDCODED_EMPLOYEES, HARDCODED_ACTIVITIES, scoreExpert } from '../utils/expertScoring';

// Let's model a mock or real Coral API integration.
// Coral uses active vector-like indexing of employee logs.

interface CoralRetrievalOptions {
  apiKey?: string;
  endpoint?: string;
}

export class CoralService {
  private config: CoralRetrievalOptions;

  constructor(options: CoralRetrievalOptions = {}) {
    this.config = {
      apiKey: (import.meta as any).env.VITE_CORAL_API_KEY || options.apiKey,
      endpoint: (import.meta as any).env.VITE_CORAL_ENDPOINT || options.endpoint || "https://api.coral.cyberdyne.io/v1",
      ...options
    };
  }

  /**
   * Evaluates and ranks documents based on relevance to the query.
   * Compiles activity logs into a standard Coral document format.
   */
  public async retrieveAndRankDocuments(query: string): Promise<CoralDocument[]> {
    console.log(`[Coral Retrieval] Initiated knowledge query: "${query}"`);
    
    // Simulate API delay or fetch if configured
    await new Promise((resolve) => setTimeout(resolve, 800));

    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    if (words.length === 0) {
      return HARDCODED_ACTIVITIES.slice(0, 5).map(act => this.convertToCoralDoc(act, 50));
    }

    const docResults: CoralDocument[] = HARDCODED_ACTIVITIES.map(act => {
      let score = 0;
      const text = `${act.title} ${act.description}`.toLowerCase();

      words.forEach(word => {
        if (text.includes(word)) score += 25;
      });

      if (text.includes(query.toLowerCase())) score += 40;

      // Type weight modifiers
      if (act.type === 'github') score += 10;
      if (act.type === 'documentation') score += 15;

      return this.convertToCoralDoc(act, Math.min(100, score));
    });

    // Sort descending by score, only return documents with score > 0
    return docResults
      .filter(doc => doc.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Retrieves experts based on ranked evidence.
   */
  public async retrieveAndRankExperts(query: string): Promise<ExpertRankingResult[]> {
    const relevantDocs = await this.retrieveAndRankDocuments(query);
    
    const rankings: ExpertRankingResult[] = HARDCODED_EMPLOYEES.map(emp => {
      const evaluation = scoreExpert(query, emp, HARDCODED_ACTIVITIES);
      return {
        employee: emp,
        score: evaluation.score,
        evidence: evaluation.matchingEvidence,
        reason: evaluation.reason
      };
    });

    // Return ranked experts above 0 score, or highest if all are 0
    return rankings
      .filter(rank => rank.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Complete unified retrieval sequence: User Query -> Coral Retrieval -> Experts -> Rationale
   */
  public async query(query: string): Promise<SearchResult> {
    // 1. Retrieve & Rank Documents
    const documents = await this.retrieveAndRankDocuments(query);
    
    // 2. Retrieve & Rank Experts
    const rankedExperts = await this.retrieveAndRankExperts(query);
    const topRank = rankedExperts[0];

    if (!topRank || topRank.score === 0) {
      return {
        query,
        topExpert: null,
        evidence: [],
        reasoning: `No clear footprint evidence found across Github, Slack, Jira, or Notion indexing for your query. Let's widen the search parameters.`,
        confidenceScore: 0,
        coralDocuments: documents
      };
    }

    // Build the reasoning and confidence output from direct evidence metrics
    const confidenceScore = topRank.score;
    const evidenceCount = topRank.evidence.length;
    
    let reasoning = `Coral knowledge-index audited ${documents.length} repositories, files, and discussion logs. `;
    reasoning += `${topRank.employee.name} was ranked as the primary match with ${confidenceScore}% confidence based on ${evidenceCount} distinct matching digital footprints. `;
    reasoning += `Key evidence: "${topRank.evidence[0]?.title || 'System contribution logs'}".`;

    return {
      query,
      topExpert: topRank.employee,
      evidence: topRank.evidence,
      reasoning,
      confidenceScore,
      coralDocuments: documents
    };
  }

  private convertToCoralDoc(act: Activity, score: number): CoralDocument {
    return {
      id: act.id,
      title: act.title,
      content: act.description,
      type: act.type,
      author: act.employeeName,
      timestamp: act.timestamp,
      relevanceScore: score
    };
  }
}

export const coralService = new CoralService();
