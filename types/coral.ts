export type EvidenceSource = 'GitHub' | 'Slack' | 'Jira' | 'Notion' | 'Documentation';

export interface Evidence {
  id: string;
  source: EvidenceSource;
  title: string;
  author: string;
  content: string;
  url: string;
  timestamp: string;
  score?: number; // Retrieval match score
}

export interface ExpertScore {
  name: string;
  score: number; // Overall composite score
  matchCount: number;
  breakdown: {
    GitHub: number;
    Slack: number;
    Jira: number;
    Notion: number;
    Documentation: number;
  };
  reasons: string[];
}

export interface CoralQueryResult {
  query: string;
  evidence: Evidence[];
  rankedExperts: ExpertScore[];
  explanation: string;
}

export interface EmployeeProfile {
  name: string;
  role: string;
  payrollStatus: 'Active' | 'Disputed' | 'Anomaly';
  monthlySalary: number;
  digitalFootprintScore: number; // Calculated based on actual activity
  lastActive: string;
  activityBreakdown: {
    GitHub: number;
    Slack: number;
    Jira: number;
    Notion: number;
  };
}
