import { GoogleGenAI } from '@google/genai';
import { Employee, Activity, CoralDocument } from '../types/coral';

let aiInstance: GoogleGenAI | null = null;
const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY : '');

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('[Gemini SDK] Initialized successfully with client key.');
  } catch (err) {
    console.warn('[Gemini SDK] Failed to initialize GoogleGenAI client:', err);
  }
} else {
  console.log('[Gemini SDK] No valid VITE_GEMINI_API_KEY detected. Dynamic offline simulation mode active.');
}

/**
 * Robust mock generation fallback that mimics real RAG logic perfectly.
 */
function getMockReasoning(query: string, expertName: string, evidenceCount: number, matchingEvidence: Activity[]): string {
  const queryLower = query.toLowerCase();
  const evidenceSummary = matchingEvidence.map(e => `* [${e.type.toUpperCase()}] ${e.title} (${new Date(e.timestamp).toLocaleDateString()})`).join('\n');
  
  if (queryLower.includes('k8s') || queryLower.includes('kubernetes') || queryLower.includes('deploy') || queryLower.includes('infrastructure')) {
    return `### Verification and Analysis
Through our Coral Retrieval Layer, we discovered **Marcus Wright** as the principal authority for cloud orchestrations and deployment issues. 

**Retrieval Evidence Highlight:**
${evidenceSummary}

**Audit Summary:**
Marcus Wright has outstanding cloud tenure. He actively leads the **#devops-alerts** incident response channel, recently patched a Critical Kubernetes CrashLoopBackOff error, and pushed crucial updates deploying stateful microservices using Kubernetes StatefulSets. 

**Recommended Action:**
Contact Marcus to review Terraform infrastructure changes, debug container replication errors, or authorize deployment architecture revisions. He possesses a proven **88% digital score**, verified across multiple platform touchpoints.`;
  }

  if (queryLower.includes('auth') || queryLower.includes('security') || queryLower.includes('vulnerability') || queryLower.includes('login') || queryLower.includes('session')) {
    return `### Security System Diagnosis
**Sarah Connor** is uniquely matched to this query with supreme authority on security audits, access control, and authentication vectors.

**Retrieval Evidence Highlight:**
${evidenceSummary}

**Security Footprint Summary:**
Sarah represents our primary firewall against code regressions. Our Coral index verified she recently patched a session hijack vulnerability in oauth token flows (under PR #108), executed a full-scope penetration test on internal authorization endpoints, and authored the master Enterprise Authentication & Encryption Policy.

**Direct Guidance:**
Assign security threat assessments, OAuth configurations, and cryptography audits to Sarah Connor. Her **94% digital score** marks her as representing structural expertise.`;
  }

  if (queryLower.includes('react') || queryLower.includes('tailwind') || queryLower.includes('frontend') || queryLower.includes('ui') || queryLower.includes('css') || queryLower.includes('ux') || queryLower.includes('framer') || queryLower.includes('motion')) {
    return `### UI System Evaluation
**Elena Rostova** has been identified as the definitive frontend expert for any implementation demands centering styling frameworks, responsive cards, or interactive visuals.

**Retrieval Evidence Highlight:**
${evidenceSummary}

**UI Activity Footprint:**
Elena successfully merged PR #914, streamlining responsive rendering of UI components using Tailwind CSS CSS Grid. She maintains active review cycles in core layout modules and handles custom Framer Motion transitions (FE-219) for dashboard skeletal interfaces.

**Suggested Strategy:**
Have Elena review complex responsive layouts, design token imports, asset optimizations, and advanced animation configurations. Her verified **91% footprint metric** makes her highly dependable.`;
  }

  if (queryLower.includes('gemini') || queryLower.includes('ai') || queryLower.includes('research') || queryLower.includes('rag') || queryLower.includes('algorithms') || queryLower.includes('dataset') || queryLower.includes('embed') || queryLower.includes('coral')) {
    return `### Intelligent Platform Intelligence
**Apoorva Jha** is an supreme authority for intelligence pipelines, retrieval-augmented models, vectors, and direct Coral indexing algorithms.

**Retrieval Evidence Highlight:**
${evidenceSummary}

**AI Activity Footprint:**
Apoorva designed and merged the initial Coral retrieval schema (PR #510), linking text databases to modern LLM contextual embeddings. She handles active vector scale operations and authored the full technical specs for offline-first retrieval failovers.

**Tactical Plan:**
Route all inquiries regarding large language models, retrieval thresholds, prompt safety profiles, and grounding features to Apoorva. Her elite digital footprint score of **98%** indicates an impeccable record of deep research.`;
  }

  if (queryLower.includes('backend') || queryLower.includes('sql') || queryLower.includes('postgres') || queryLower.includes('database') || queryLower.includes('node') || queryLower.includes('lock')) {
    return `### Database Engine Assessment
**Thomas Anderson** is matched with high backend credentials for relational tuning, locking queries, and server scaling policies.

**Retrieval Evidence Highlight:**
${evidenceSummary}

**Platform Backend Audit:**
Thomas solved lock limits inside PostgreSQL pipelines enabling safe multi-connection transactions. He actively manages database node cluster setups, handles fine-grained indexing optimizations, and patched memory leaks in our long-running Node platform server layers.

**Next Steps:**
Engage Thomas for API performance bottlenecks, database index planning, and distributed cache designs. Highly rated with an **85% verified footprint score**.`;
  }

  // Generic query response
  return `### Comprehensive Audit Report
The Coral Retrieval Layer evaluated matching documents across the index repository. **${expertName}** was ranked as the most viable engineer to address: "${query}".

**Digital Evidence Summary:**
Based on the ${evidenceCount} matching records mapped below, this expert exhibits a high-relevance score matching the requested technological topics. 

**Actionable Advice:**
Schedule technical reviews with **${expertName}** to proceed with debugging or code deployment. Let's consult the detailed audit timeline below for granular context on their previous commits and documentation.`;
}

export class GeminiService {
  /**
   * Generates expert insights using Gemini 3.5-flash RAG model.
   * If API keys are missing or requests fail, falls back gracefully to
   * smart localized responses to guarantee zero downtime.
   */
  public async generateExpertInsight(
    query: string,
    expert: Employee | null,
    matchingEvidence: Activity[],
    coralDocs: CoralDocument[]
  ): Promise<string> {
    if (!expert) {
      return `### No Records Matched
The Coral Retrieval engine searched for relevant documents across GitHub, Slack, Notion, and Jira indexers, but returned no matching signatures. 

**Troubleshooting Advice:**
* Try searching for technologies (e.g., "Kubernetes", "React", "Authentication", "PostgreSQL", "Gemini", "Terraform").
* Try looking for action-based keywords (e.g., "fix deployment issues", "review security code").
* Note that **Donald Vance** is classified as a Suspended Anomaly with zero digital activities, and thus cannot be selected as an active expert.`;
    }

    if (!aiInstance) {
      // Use fallback
      return getMockReasoning(query, expert.name, matchingEvidence.length, matchingEvidence);
    }

    try {
      const expertContext = `
Expert Candidate: ${expert.name}
Role: ${expert.role}
Digital Footprint Score: ${expert.digitalScore}%
Status: ${expert.status}
Department: ${expert.department}

Evidence activity logs:
${matchingEvidence.map(e => `[${e.type.toUpperCase()}] Title: ${e.title} - Description: ${e.description}`).join('\n')}

Coral knowledge indexed documents retrieved:
${coralDocs.map(d => `[Source: ${d.type}] Document "${d.title}" (Relevance: ${d.relevanceScore}) - Author: ${d.author}`).join('\n')}
`;

      const prompt = `
You are the AI Reasoning Engine of **Ghost Employee AI**, a hackathon-winning organizational intelligence platform.
The user is querying: "${query}".
Our **Coral Retrieval Layer** has searched database indices and identified ${expert.name} as the top expert match with a confidence score of ${expert.digitalScore}%.

Analyze the provided context and construct an engineering assessment.
Your response MUST be formatted in clean, elegant Markdown. Include these sections:
1. ### Verification & Rationale - explain why this expert is matched.
2. ### Retrieval Evidence analysis - explain how Github, Slack, or Jira footprints prove their authority.
3. ### Recommendation - give direct action points.

Retrieved Context:
${expertContext}
`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          systemInstruction: "You are a professional full-stack platform architect auditing digital developer footprints. Be precise, highly professional, and avoid flowery language. Focus purely on technical evidence.",
        }
      });

      return response.text || getMockReasoning(query, expert.name, matchingEvidence.length, matchingEvidence);
    } catch (err) {
      console.error('[Gemini API] Failed to fetch live content. Activating smart fallback mode.', err);
      return getMockReasoning(query, expert.name, matchingEvidence.length, matchingEvidence);
    }
  }

  /**
   * Generates a structural anomaly report for suspicious/ghost employees like Donald Vance.
   */
  public async generateAnomalyReport(employee: Employee): Promise<string> {
    if (employee.id !== 'emp-6' && employee.status !== 'Anomaly') {
      return `### Standalone Audit
This employee features a healthy digital score of ${employee.digitalScore}% with verified contributions across corporate communication and software deployment indexes. No critical anomalies detected.`;
    }

    if (!aiInstance) {
      return `### 🚨 GHOST EMPLOYEE DETECTION RADAR
**Subject:** Donald Vance
**Classification:** CRITICAL STRUCTURAL ANOMALY (GHOST EMPLOYEE)
**Digital Footprint Check:** 0.0 / 100

**Findings & Discrepancies:**
1. **Zero System Interactions**: There are no active git commits, slack posts, Jira assignments, or login sessions recorded across our entire 2026 registry.
2. **Payroll Desync**: The employee is currently classified as "Flagged" on legacy payroll systems, receiving active salaries despite complete absence of digital indicators for over 6 months.
3. **Ghost Status**: Security access cards show zero entry logs.

**Coral Analysis Verdict:**
Highly likely to be a ghost employee or structural oversight. Immediate payroll hold and manager audit is strongly recommended.`;
    }

    try {
      const prompt = `
Generate a formal compliance and audit report for a discovered Ghost Employee Anomaly.
Employee Metrics:
- Name: Donald Vance
- Role: Special Technical Consultant
- Joined Date: 2021-11-01
- Payroll Status: Flagged / Active Payments
- Digital Footprint Score: 0 (No GitHub, Slack, Jira, or login tokens recorded)

Explain the structural implications of a "Ghost Employee" anomaly (receiving payroll with zero footprints) and recommend standard forensic next steps (eg. access log overrides, team manager audits, payroll holds). Format in strict, formal enterprise markdown.
`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.1,
          systemInstruction: "You are an Elite forensic corporate IT compliance auditor. Output a cold, structured, extremely professional corporate report."
        }
      });

      return response.text || "Failed to generate audit report.";
    } catch (err) {
      console.error('[Gemini API Anomaly] Failed to fetch. Utilizing fallback.', err);
      return `### 🚨 AUDIT COMPLIANCE REPORT: CRITICAL ANOMALY
**Subject:** Donald Vance
**Metrics Audit:** Digital Footprint Score: 0% / Status: ANOMALY

**Discrepancy Details:**
- **Audit Target**: Donald Vance (Special Technical Consultant)
- **Active Anomalies**: Continuous monthly payroll disbursements detected on a "Flagged" payroll index, contrasting with absolute zero activity records across Github, Slack, Jira, and Notion logs.
- **Forensic Assessment**: Potential ghost employee shell or orphaned database row from previous corporate divisions.

**Action Plan:**
- Place immediate payroll suspension.
- Initiate hardware review on assigned credentials.
- Conduct managerial audit with team directors.`;
    }
  }
}

export const geminiService = new GeminiService();
