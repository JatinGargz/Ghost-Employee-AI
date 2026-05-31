import { Employee, Activity } from '../types/coral';

export const HARDCODED_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "Sarah Connor",
    role: "Lead Cybersecurity Architect",
    email: "s.connor@cyberdyne.io",
    payrollStatus: "Active",
    digitalScore: 94,
    status: "Verified",
    githubUsername: "sconnor-tech",
    slackId: "U_S_CONNOR",
    joinedDate: "2023-01-15",
    department: "Security"
  },
  {
    id: "emp-2",
    name: "Marcus Wright",
    role: "Principal Infrastructure Engineer",
    email: "m.wright@cyberdyne.io",
    payrollStatus: "Active",
    digitalScore: 88,
    status: "Verified",
    githubUsername: "mwright-kube",
    slackId: "U_M_WRIGHT",
    joinedDate: "2023-06-20",
    department: "DevOps & Cloud"
  },
  {
    id: "emp-3",
    name: "Elena Rostova",
    role: "Senior UI/UX Engineer",
    email: "e.rostova@cyberdyne.io",
    payrollStatus: "Active",
    digitalScore: 91,
    status: "Verified",
    githubUsername: "elena-codes",
    slackId: "U_E_ROSTOVA",
    joinedDate: "2024-02-10",
    department: "Frontend Engineering"
  },
  {
    id: "emp-4",
    name: "Thomas Anderson",
    role: "Senior Backend Developer",
    email: "t.anderson@cyberdyne.io",
    payrollStatus: "Active",
    digitalScore: 85,
    status: "Verified",
    githubUsername: "neo-matrix",
    slackId: "U_T_ANDERSON",
    joinedDate: "2022-09-01",
    department: "Core Platform"
  },
  {
    id: "emp-5",
    name: "Apoorva Jha",
    role: "AI & Retrieval Research Lead",
    email: "ajha@cyberdyne.io",
    payrollStatus: "Active",
    digitalScore: 98,
    status: "Verified",
    githubUsername: "apoorva-jha",
    slackId: "U_A_JHA",
    joinedDate: "2024-05-12",
    department: "AI & Research"
  },
  {
    id: "emp-6",
    name: "Donald Vance",
    role: "Special Technical Consultant",
    email: "d.vance@cyberdyne.io",
    payrollStatus: "Flagged",
    digitalScore: 0,
    status: "Anomaly",
    githubUsername: "dvance-retired",
    slackId: "U_D_VANCE",
    joinedDate: "2021-11-01",
    department: "Enterprise Consulting"
  }
];

export const HARDCODED_ACTIVITIES: Activity[] = [
  // Marcus Wright DevOps / K8s / Terraform
  {
    id: "act-1",
    employeeId: "emp-2",
    employeeName: "Marcus Wright",
    type: "github",
    timestamp: "2026-05-30T14:22:00Z",
    title: "Merged PR #412: Stabilize production Kubernetes cluster deployment configurations",
    description: "Configured resource limits, liveness probes, and horizontal pod autoscalers for core microservices."
  },
  {
    id: "act-2",
    employeeId: "emp-2",
    employeeName: "Marcus Wright",
    type: "slack",
    timestamp: "2026-05-30T10:15:00Z",
    title: "#devops-alerts: Incident response on staging Kubernetes deployment",
    description: "Resolved CrashLoopBackOff on core auth deployment by correcting service account permissions and config map definitions."
  },
  {
    id: "act-3",
    employeeId: "emp-2",
    employeeName: "Marcus Wright",
    type: "jira",
    timestamp: "2026-05-29T16:45:00Z",
    title: "INFRA-4819: Migrate legacy databases to Kubernetes StatefulSets",
    description: "Completed migration plan, verified PVC provisioning, and configured backup cronjobs with direct bucket uploads."
  },
  {
    id: "act-4",
    employeeId: "emp-2",
    employeeName: "Marcus Wright",
    type: "notion",
    timestamp: "2026-05-28T09:30:00Z",
    title: "Created Page: Cloud Architecture & Terraform Standard Operating Procedures",
    description: "An exhaustive guide on writing reusable Terraform modules, managing state files in secure remote backends, and configuring CI/CD pipelines via GitHub Actions."
  },
  {
    id: "act-5",
    employeeId: "emp-2",
    employeeName: "Marcus Wright",
    type: "documentation",
    timestamp: "2026-05-27T11:00:00Z",
    title: "Kubernetes Disaster Recovery Guide V2",
    description: "Documented the multi-region failover routine, etcd restore commands, and active dns failover protocols."
  },

  // Elena Rostova Frontend / React / Tailwind
  {
    id: "act-6",
    employeeId: "emp-3",
    employeeName: "Elena Rostova",
    type: "github",
    timestamp: "2026-05-31T08:12:00Z",
    title: "Merged PR #914: Refactor dashboard shell to use Tailwind CSS V4 grid & Framer Motion transitions",
    description: "Optimized critical rendering path by removing redundant React wrappers and streamlining flex layouts."
  },
  {
    id: "act-7",
    employeeId: "emp-3",
    employeeName: "Elena Rostova",
    type: "slack",
    timestamp: "2026-05-30T11:40:00Z",
    title: "#frontend-ux: Feedback on the new dashboard metrics component",
    description: "Suggested responsive card designs, subtle hover scaling effects, and unified the spacing system with off-white card fills."
  },
  {
    id: "act-8",
    employeeId: "emp-3",
    employeeName: "Elena Rostova",
    type: "jira",
    timestamp: "2026-05-29T14:30:00Z",
    title: "FE-219: Add standard skeleton loaders and layout transitions to loading states",
    description: "Implemented custom motion.div animations with subtle fade and stagger parameters to make load sequence feel organic."
  },
  {
    id: "act-9",
    employeeId: "emp-3",
    employeeName: "Elena Rostova",
    type: "notion",
    timestamp: "2026-05-28T15:00:00Z",
    title: "Updated Page: Frontend Component Styling Standards with TailwindCSS",
    description: "Defined rules on removing custom css, utilizing @import 'tailwindcss' correctly, and pairing Inter with Space Grotesk."
  },

  // Sarah Connor Cybersecurity / Security Audit / Auth
  {
    id: "act-10",
    employeeId: "emp-1",
    employeeName: "Sarah Connor",
    type: "github",
    timestamp: "2026-05-31T12:00:00Z",
    title: "Merged PR #108: Resolve authentication token session hijack vulnerability",
    description: "Enhanced OAuth scope checks, enforced HTTP-only secure cookies with SameSite lax parameters, and tightened token expiration rules."
  },
  {
    id: "act-11",
    employeeId: "emp-1",
    employeeName: "Sarah Connor",
    type: "slack",
    timestamp: "2026-05-30T17:05:00Z",
    title: "#cybersec-announcements: Key Rotation & Secure Authentication Upgrade completed",
    description: "Successfully updated all backend session encryption keys. Reminded developers to check Auth validation code."
  },
  {
    id: "act-12",
    employeeId: "emp-1",
    employeeName: "Sarah Connor",
    type: "jira",
    timestamp: "2026-05-29T10:00:00Z",
    title: "SEC-104: Perform internal penetration testing on auth routes",
    description: "Discovered and patched potential timing attack vector in hash verification flow. Verified no data leaked."
  },
  {
    id: "act-13",
    employeeId: "emp-1",
    employeeName: "Sarah Connor",
    type: "notion",
    timestamp: "2026-05-25T14:00:00Z",
    title: "Created Page: Enterprise Authentication and Key Management Policy",
    description: "Outlines multi-factor authentication (MFA) rules, rotation schedules, and OAuth client registration guidelines."
  },

  // Apoorva Jha AI / Retrieval / Coral / RAG / Gemini
  {
    id: "act-14",
    employeeId: "emp-5",
    employeeName: "Apoorva Jha",
    type: "github",
    timestamp: "2026-05-31T15:30:00Z",
    title: "Merged PR #510: Integrate Coral RAG retrieval layer in core intelligence pipelines",
    description: "Connected deep search indices with the Coral service, enabling evidence-grounded AI generation with confidence metrics."
  },
  {
    id: "act-15",
    employeeId: "emp-5",
    employeeName: "Apoorva Jha",
    type: "slack",
    timestamp: "2026-05-31T09:12:00Z",
    title: "#ai-research-labs: Testing Coral Retrieval-Augmented Generation models",
    description: "Achieved a 94% accuracy score by feeding fetched evidence chunks directly into Gemini LLM reasoning windows."
  },
  {
    id: "act-16",
    employeeId: "emp-5",
    employeeName: "Apoorva Jha",
    type: "jira",
    timestamp: "2026-05-28T16:15:00Z",
    title: "AI-118: Scale vector databases for indexing Slack, Jira, and GitHub footprints",
    description: "Engineered real-time scraping listeners and created unified document embeddings for multi-source retrieval."
  },
  {
    id: "act-17",
    employeeId: "emp-5",
    employeeName: "Apoorva Jha",
    type: "notion",
    timestamp: "2026-05-27T10:00:00Z",
    title: "Created Page: Coral Search Engine Integration Specifications",
    description: "Contains API interaction parameters, fallback mechanisms for offline/local simulation, and document relevance weights."
  },

  // Thomas Anderson (Neo) Backend / SQL/ Node
  {
    id: "act-18",
    employeeId: "emp-4",
    employeeName: "Thomas Anderson",
    type: "github",
    timestamp: "2026-05-30T23:55:00Z",
    title: "Merged PR #302: Redesign PostgreSQL write pipelines for parallel transaction consistency",
    description: "Engineered distributed locks using Redis to throttle connection limits under flash traffic loads."
  },
  {
    id: "act-19",
    employeeId: "emp-4",
    employeeName: "Thomas Anderson",
    type: "slack",
    timestamp: "2026-05-30T13:30:00Z",
    title: "#backend-core: Database locking issues solved with fine-grained index tuning",
    description: "Optimized search queries spanning four joined activity tables, dropping median response time from 1600ms to 45ms."
  },
  {
    id: "act-20",
    employeeId: "emp-4",
    employeeName: "Thomas Anderson",
    type: "jira",
    timestamp: "2026-05-28T11:22:00Z",
    title: "CORE-992: Diagnose memory leaks in long-running Node server instance",
    description: "Isolated heap growth to an unclosed subscription handler. Patched and redeployed."
  }
];

export function scoreExpert(query: string, employee: Employee, activities: Activity[]): {
  score: number;
  matchingEvidence: Activity[];
  reason: string;
} {
  const queryLower = query.toLowerCase();
  
  // Calculate relative matches based on activity titles and descriptions
  const matchingEvidence = activities.filter(act => {
    if (act.employeeId !== employee.id) return false;
    const textToSearch = `${act.title} ${act.description} ${(act.content || '')}`.toLowerCase();
    
    // Exact phrase or individual keyword overlap check
    const words = queryLower.split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return textToSearch.includes(queryLower);
    
    // Check if any keyword matches
    const hasWordMatch = words.some(word => textToSearch.includes(word));
    // Bonus if query as a whole matches
    const hasPhraseMatch = textToSearch.includes(queryLower);
    
    return hasWordMatch || hasPhraseMatch;
  });

  // Calculate base score
  let score = 0;
  
  if (employee.status === "Anomaly" || employee.digitalScore === 0) {
    return {
      score: 0,
      matchingEvidence: [],
      reason: "Employee has been classified as a Ghost Anomaly with zero verified digital footprints."
    };
  }

  // Keywords weights
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  matchingEvidence.forEach(act => {
    let actScore = 30; // base activity weight
    if (act.type === 'github') actScore += 15; // GitHub commits have highest weight
    if (act.type === 'documentation') actScore += 10; // Documentation counts heavily for explanations
    
    // Keyword match density bonus
    const titleAndDesc = `${act.title} ${act.description}`.toLowerCase();
    queryWords.forEach(word => {
      if (titleAndDesc.includes(word)) actScore += 10;
    });

    score += actScore;
  });

  // Add overall expertise score from employee profile digital footprint
  score += Math.round(employee.digitalScore * 0.3);

  // Generate rationale reasoning
  let reason = "";
  if (matchingEvidence.length > 0) {
    const mainAction = matchingEvidence[0];
    const sourceLabel = mainAction.type.toUpperCase();
    reason = `Identified as top expert due to significant recent contributions, outstandingly PRs and logs in ${sourceLabel}: "${mainAction.title}". Outstanding footprint metrics align with ${employee.role} capabilities.`;
  } else {
    reason = `Low alignment score. Matches generic digital activities but lacks direct proof for task: "${query}".`;
  }

  // Cap score at 100 for confidence/neatness
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    score: finalScore,
    matchingEvidence,
    reason
  };
}
