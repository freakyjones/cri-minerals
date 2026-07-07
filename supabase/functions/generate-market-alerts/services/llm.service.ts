import { MODELS_TO_TRY, GEMINI_API_BASE } from '../config/index.ts';
import { extractJsonArray } from '../utils/parsers.ts';

async function callGeminiApi(model: string, geminiKey: string, prompt: string) {
  if (!MODELS_TO_TRY.includes(model)) {
    throw new Error(`Model ${model} is not allowed.`);
  }
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${geminiKey}`;
  if (!url.startsWith('https://generativelanguage.googleapis.com/')) {
    throw new Error('Invalid Gemini API destination');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => { controller.abort(); }, 20000);

  const geminiRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              description: { type: "STRING" },
              severity: { type: "STRING" },
              confidenceScore: { type: "NUMBER" },
              rationale: { type: "ARRAY", items: { type: "STRING" } },
              blastRadius: { type: "OBJECT", nullable: true, properties: { lat: { type: "NUMBER" }, lng: { type: "NUMBER" }, radius: { type: "NUMBER" } } },
              disruptionMultiplier: { type: "NUMBER", nullable: true },
              affectedMinerals: { type: "ARRAY", items: { type: "STRING" }, nullable: true }
            },
            required: ["title", "description", "severity"]
          }
        }
      }
    })
  });
  clearTimeout(timeoutId);

  if (!geminiRes.ok) {
    const errorText = await geminiRes.text();
    throw new Error(`${model} API error: ${errorText}`);
  }

  return await geminiRes.json();
}

export async function generateAlertsFromNews(newsText: string): Promise<Record<string, unknown>[]> {
  const geminiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('CRI_MINERALS_GEMINI_API_KEY');
  if (!geminiKey) throw new Error("Missing GEMINI_API_KEY environment variable");

  const prompt = `You are an elite Critical Minerals Intelligence Analyst. Your mandate is to monitor global news for early warning signals regarding critical minerals and assess their impact on global supply chains.
Your task is to analyze the provided recent news headlines and descriptions, and extract up to 3 major market or geopolitical alerts.
Extract a maximum of 3 alerts. Choose only the most impactful events. If no significant events, return [].
Output an array of objects matching this exact JSON schema:
[
  {
    "title": "String",
    "description": "String",
    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
    "confidenceScore": "Number",
    "rationale": ["String", "String"],
    "blastRadius": { "lat": "Number", "lng": "Number", "radius": "Number" },
    "disruptionMultiplier": "Number",
    "affectedMinerals": ["String", "String"]
  }
]
Recent News:
${newsText}`;

  let geminiData = null;
  let lastError = null;

  for (const model of MODELS_TO_TRY) {
    try {
      geminiData = await callGeminiApi(model, geminiKey, prompt);
      break; 
    } catch (e) {
      lastError = e;
    }
  }

  if (!geminiData) {
    if (lastError) {
      throw lastError;
    }
    throw new Error("All fallback models failed.");
  }

  const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
  return extractJsonArray(resultText);
}
