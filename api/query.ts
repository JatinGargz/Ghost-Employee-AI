import { GoogleGenAI } from '@google/genai';
import { CoralService } from '../services/coralService';
import { calculateExpertScores } from '../utils/expertScoring';

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite corporate SRE and compliance auditor. Synthesize knowledge from digital footnotes accurately and advise on domain experts with structural code or operational snippets where appropriate.',
          temperature: 0.2,
        }
      });

      explanation = response.text || 'Failed to synthesize a response from Gemini.';
    }

    res.status(200).json({
      query,
      evidence,
      rankedExperts,
      explanation,
    });

  } catch (error: any) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
