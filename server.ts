import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { CoralService } from './services/coralService';
import { calculateExpertScores } from './utils/expertScoring';
import { EmployeeProfile } from './types/coral';

// Load environment configuration
dotenv.config();

// Standard lazy-initialized Gemini client with telemetry header
const getGeminiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup AI Studio major server capability
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // KPI Anomaly Audit - detects "ghost employees" on payroll with ZERO digital activity
  app.get('/api/audit', (req, res) => {
    const footprints = CoralService.getEmployeeFootprints();
    const employees: EmployeeProfile[] = [
      {
        name: 'Sarah Connor',
        role: 'DevOps Engineer',
        payrollStatus: 'Active',
        monthlySalary: 8500,
        digitalFootprintScore: 92,
        lastActive: '2026-05-30T14:22:00Z',
        activityBreakdown: footprints['Sarah Connor'] as any,
      },
      {
        name: 'Marcus Wright',
        role: 'Senior Backend Engineer',
        payrollStatus: 'Active',
        monthlySalary: 9800,
        digitalFootprintScore: 88,
        lastActive: '2026-05-29T13:10:00Z',
        activityBreakdown: footprints['Marcus Wright'] as any,
      },
      {
        name: 'Elena Rostova',
        role: 'Lead Frontend UI Developer',
        payrollStatus: 'Active',
        monthlySalary: 9200,
        digitalFootprintScore: 95,
        lastActive: '2026-05-31T00:45:00Z',
        activityBreakdown: footprints['Elena Rostova'] as any,
      },
      {
        name: 'Thomas Anderson',
        role: 'Security & Auth Engineer',
        payrollStatus: 'Active',
        monthlySalary: 8900,
        digitalFootprintScore: 81,
        lastActive: '2026-05-30T15:00:00Z',
        activityBreakdown: footprints['Thomas Anderson'] as any,
      },
      {
        name: 'Apoorva Jha',
        role: 'Staff Generative AI Engineer',
        payrollStatus: 'Active',
        monthlySalary: 11000,
        digitalFootprintScore: 94,
        lastActive: '2026-05-31T01:10:00Z',
        activityBreakdown: footprints['Apoorva Jha'] as any,
      },
      {
        name: 'Donald Vance',
        role: 'Principal SRE Architect',
        payrollStatus: 'Anomaly', // Highlighted Ghost payroll entry!
        monthlySalary: 14500, // Getting paid, but has 0 footprint across Slack, Jira, GitHub, Notion
        digitalFootprintScore: 0,
        lastActive: 'Never',
        activityBreakdown: footprints['Donald Vance'] as any,
      },
    ];

    res.json(employees);
  });

  // Search Knowledge Query - orchestrates Coral RAG -> Expert Score -> Gemini AI Explanation
  app.post('/api/query', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query parameter is required' });
        return;
      }

      // Step 1: Retrieve matching evidence using our multi-channel simulated CoralService
      const evidence = await CoralService.retrieveEvidence(query);

      // Step 2: Calculate individual authority & expert rankings
      const rankedExperts = calculateExpertScores(evidence);

      // Step 3: Run Gemini to construct a clear synthesis of retrieved documents and recommend domain experts
      let explanation = '';
      if (evidence.length === 0) {
        explanation = "No relevant knowledge or digital footprint evidence was retrieved from GitHub, Slack, Jira, Notion, or internal Documentation. As an Auditor AI, I recommend verifying if this topic is covered in unindexed private databases, or confirming if the query parameters correspond to active enterprise domains.";
      } else {
        const ai = getGeminiClient();
        const topEvidenceText = evidence
          .map((ev, i) => `[Evidence #${i + 1}] Source: ${ev.source} | Title: ${ev.title} | Author: ${ev.author} | Content: "${ev.content}"`)
          .join('\n\n');

        const expertsText = rankedExperts
          .map((exp, i) => `#${i + 1} Expert: ${exp.name} (Relevance Score: ${exp.score}, Contributions Matched: ${exp.matchCount})`)
          .join('\n');

        const prompt = `
You are the Ghost Employee AI Auditor. Your job is to analyze the retrieved corporate system records (evidence) and ranked active experts to answer the user's search query.

User Query: "${query}"

Retrieved Digital Artifacts:
${topEvidenceText}

Domain Experts Ranked by Digital Activity Profile:
${expertsText}

Instructions:
1. Provide a professional, direct, and factual synthesized explanation/answer based on the retrieved evidence.
2. Clearly highlight **the top expert(s)** the user should contact and explain why based on their specific digital actions.
3. Keep the tone analytical, precise, and professional.
4. Format your response beautifully in standard Markdown. Use bullet points and bold highlights.
5. If some search keyword matches the SRE Architect Donald Vance, note that despite his senior payroll listing, he exhibits 0 digital activities and represents an unvalidated audit anomaly.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite corporate SRE and compliance auditor. Synthesize knowledge from digital footnotes accurately and advise on domain experts with structural code or operational snippets where appropriate.',
            temperature: 0.2,
          }
        });

        explanation = response.text || 'Failed to synthesize a response from Gemini.';
      }

      res.json({
        query,
        evidence,
        rankedExperts,
        explanation,
      });

    } catch (error: any) {
      console.error('Error processing query:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

  // Mount Vite development or production bundle loaders
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ghost Employee AI server booting on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot failure:', err);
});
