export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  payrollStatus: 'Active' | 'Flagged' | 'Suspended';
  digitalScore: number; // 0 - 100
  status: 'Verified' | 'Anomaly' | 'Needs Review';
  githubUsername?: string;
  slackId?: string;
  joinedDate: string;
  department: string;
}

export type ActivityType = 'github' | 'slack' | 'jira' | 'notion' | 'documentation';

export interface Activity {
  id: string;
  employeeId: string;
  employeeName: string;
  type: ActivityType;
  timestamp: string;
  title: string;
  description: string;
  content?: string;
  url?: string;
  relevanceScore?: number;
}

export interface CoralDocument {
  id: string;
  title: string;
  content: string;
  type: ActivityType;
  author: string;
  timestamp: string;
  relevanceScore: number;
}

export interface ExpertRankingResult {
  employee: Employee;
  score: number;
  evidence: Activity[];
  reason: string;
}

export interface SearchResult {
  query: string;
  topExpert: Employee | null;
  evidence: Activity[];
  reasoning: string;
  confidenceScore: number;
  coralDocuments: CoralDocument[];
}

export interface DashboardMetricsData {
  employeesAudited: number;
  ghostEmployees: number;
  expertsIdentified: number;
  documentsIndexed: number;
}
