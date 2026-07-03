/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";

const RSS_FEEDS = [
  "https://www.mining.com/feed/"
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 1. Fix DB Anti-pattern: Initialize Supabase client outside the handler to reuse cached connection
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('SUPABASE_DB_URL');
let supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const secretKeysStr = Deno.env.get('SUPABASE_SECRET_KEYS');

if (secretKeysStr) {
  try {
    const keys = JSON.parse(secretKeysStr);
    if (Object.values(keys).length > 0) {
      supabaseServiceKey = Object.values(keys)[0] as string;
    }
  } catch (e) {
    console.error("Failed to parse SUPABASE_SECRET_KEYS", e);
  }
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase connection environment variables");
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

/**
 * Extracts and parses a JSON array from an LLM response string.
 */
function extractJsonArray(llmResponse: string): Array<Record<string, unknown>> {
  if (!llmResponse || typeof llmResponse !== "string") {
    return [];
  }

  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/ig;
  let match;
  while ((match = markdownRegex.exec(llmResponse)) !== null) {
    const content = match[1].trim();
    if (content.startsWith("[") && content.endsWith("]")) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed;
      } catch { }
    }
  }

  const lastIndex = llmResponse.lastIndexOf("]");
  if (lastIndex === -1) return [];

  let startIndex = llmResponse.indexOf("[");
  while (startIndex !== -1 && startIndex < lastIndex) {
    try {
      const jsonString = llmResponse.substring(startIndex, lastIndex + 1);
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) return parsed;
    } catch { }
    startIndex = llmResponse.indexOf("[", startIndex + 1);
  }
  return [];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Fix Security Vulnerability: Actually validate the token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response("Missing Authorization header", { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace('Bearer ', '');
    // Allow if it's the service role key (e.g. from cron) OR a valid user JWT
    if (token !== supabaseServiceKey) {
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }
    }

    // Fetch GDELT Data
    const query = '("critical minerals" OR lithium OR cobalt OR nickel OR graphite) AND (strike OR ban OR tariff OR delay OR war OR sanctions OR discovery)';
    const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&format=json&maxrecords=15`;
    const response = await fetch(gdeltUrl);
    const gdeltData = await response.json();
    
    const items = [];
    if (gdeltData && gdeltData.articles) {
      for (const article of gdeltData.articles) {
        if (article.title) {
          items.push(`Title: ${article.title}\nSource: ${article.domain}\nURL: ${article.url}`);
        }
      }
    }

    const newsText = items.join('\n\n');

    // Call Gemini API
    const geminiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('CRI_MINERALS_GEMINI_API_KEY');
    if (!geminiKey) {
      throw new Error("Missing GEMINI_API_KEY or CRI_MINERALS_GEMINI_API_KEY environment variable");
    }

    const MODELS_TO_TRY = [
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash-latest"
    ];
    
    const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

    const prompt = `You are an elite Critical Minerals Intelligence Analyst. Your mandate is to monitor global news for early warning signals regarding critical minerals (e.g., Lithium, Cobalt, Rare Earth Elements, Nickel, Copper, Graphite) and assess their impact on global supply chains, market pricing, and geopolitical security. Your audience consists of supply chain executives and policymakers who require precise, actionable, and noise-free intelligence.

Your task is to analyze the provided recent news headlines and descriptions, and extract up to 3 major market or geopolitical alerts (e.g., supply chain disruptions, export controls, strikes, major discoveries, nationalization).

### Constraints & Instructions
- Focus strictly on events that materially impact the market or geopolitical landscape. Ignore fluff, opinion pieces, and minor corporate updates.
- Extract a maximum of 3 alerts. Choose only the most impactful events.
- If there are no significant events that meet the threshold of at least 'LOW' severity, return an empty array: []
- Provide the output as raw, valid JSON ONLY. Do not use markdown code blocks (e.g., \`\`\`json) or include any preambles, postscripts, or conversational text.
- NEW: If an event involves a localized physical disruption (e.g., mine strike, localized storm, port blockade), include the \`blastRadius\` and \`disruptionMultiplier\` fields. For regulatory, market-wide, or non-spatial events, omit these fields or set them to null.

### Severity Definitions
Assign a severity level to each alert based on the following strict criteria:
- CRITICAL: Immediate, severe disruption or paradigm shift (e.g., sweeping export bans by top-tier global producers, armed conflict halting major extraction operations, sudden collapse of a major global supplier).
- HIGH: Significant, near-term impact with broad market ripples (e.g., new tariffs or trade restrictions, credible nationalization threats, ongoing labor strikes at tier-1 mines, major geopolitical realignments).
- MEDIUM: Noticeable market impact but localized, mitigatable, or longer-term (e.g., confirmed major mineral discoveries, localized mining policy changes, large mergers and acquisitions, new strategic partnerships).
- LOW: Routine market fluctuations, minor localized disruptions, or preliminary policy discussions with no immediate impact.

### Output Schema
Output an array of objects matching this exact JSON schema:
[
  {
    "title": "String (Short, punchy title summarizing the event)",
    "description": "String (1-2 concise sentences explicitly stating the event and its market/geopolitical impact)",
    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
    "confidenceScore": "Number (0-100 indicating model certainty based on source reliability and clarity)",
    "rationale": ["String (Reasoning step 1)", "String (Reasoning step 2)"],
    "blastRadius": {
      "lat": "Number (Estimated latitude of the physical disruption, e.g. -23.65. Null if not a physical disruption.)",
      "lng": "Number (Estimated longitude of the physical disruption, e.g. -70.40. Null if not a physical disruption.)",
      "radius": "Number (Estimated impact radius in km, e.g. 50. Null if not a physical disruption.)"
    },
    "disruptionMultiplier": "Number (A severity multiplier for the smart simulator, typically between 1.1 and 5.0. Required if physical disruption.)",
    "affectedMinerals": ["String", "String"] // Extract the specific critical minerals affected by this event (e.g. ["Copper", "Cobalt"]). Leave empty if it affects all minerals.
  }
]

### Input Data
Recent News:
${newsText}`;

    let geminiData = null;
    let lastError = null;

    for (const model of MODELS_TO_TRY) {
      try {
        console.log(`Attempting to generate alerts using model: ${model}`);
        const geminiRes = await fetch(`${GEMINI_API_BASE}/${model}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            // 3. Fix LLM Formatting Bug: Strongly enforce JSON output schema
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
                    blastRadius: {
                      type: "OBJECT",
                      nullable: true,
                      properties: {
                        lat: { type: "NUMBER" },
                        lng: { type: "NUMBER" },
                        radius: { type: "NUMBER" }
                      }
                    },
                    disruptionMultiplier: { type: "NUMBER", nullable: true },
                    affectedMinerals: { type: "ARRAY", items: { type: "STRING" }, nullable: true }
                  },
                  required: ["title", "description", "severity"]
                }
              }
            }
          })
        });

        if (!geminiRes.ok) {
          const errorText = await geminiRes.text();
          throw new Error(`${model} API error: ${errorText}`);
        }

        geminiData = await geminiRes.json();
        console.log(`Successfully generated alerts with ${model}`);
        break; 
      } catch (e) {
        console.warn(`Failed with model ${model}:`, e.message);
        lastError = e;
      }
    }

    if (!geminiData) {
      throw lastError || new Error("All fallback models failed.");
    }

    const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const alerts = extractJsonArray(resultText);

    if (alerts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No critical alerts found today", inserted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Robust Validation: Only process valid objects to avoid empty title emails
    const validAlerts = alerts.filter(a => typeof a === 'object' && a !== null);

    if (validAlerts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No valid structured alerts found from LLM", inserted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

     
    const rowsToInsert = validAlerts.map((alert: any) => ({
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      status: 'DRAFT',
      confidence_score: alert.confidenceScore || null,
      rationale: alert.rationale || [],
      blast_radius: alert.blastRadius || null,
      disruption_multiplier: alert.disruptionMultiplier || null,
      affected_minerals: alert.affectedMinerals || null
    }));

    if (rowsToInsert.length === 0) {
      return new Response(
        JSON.stringify({ message: "All generated alerts were malformed", inserted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from('market_alerts')
      .insert(rowsToInsert);

    if (insertError) {
      throw new Error(`DB Insert Error: ${insertError.message}`);
    }

    // Send Email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const emailTo = Deno.env.get('EMAIL_TO');
    let emailStatus = "Not attempted (missing API key or email)";

    if (resendApiKey && emailTo) {
      try {
        const emailHtml = rowsToInsert.map((a: { title: string; description: string; severity: string }) => 
          `<p><strong>${a.title}</strong> [${a.severity}]<br/>${a.description}</p>`
        ).join('<hr/>');

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Market Alerts <onboarding@resend.dev>',
            to: emailTo,
            subject: `Daily Critical Minerals Alerts (${rowsToInsert.length})`,
            html: `<h2>Today's Market Alerts</h2>${emailHtml}`
          })
        });

        if (!resendRes.ok) {
          const resendErr = await resendRes.text();
          console.error("Resend API error:", resendErr);
          emailStatus = `Failed: HTTP ${resendRes.status} - ${resendErr}`;
        } else {
          console.log("Email sent successfully via Resend.");
          emailStatus = "Success";
        }
      } catch (e) {
        console.error("Error sending email:", e);
        emailStatus = `Exception: ${e.message}`;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully inserted ${rowsToInsert.length} draft alerts`, 
        alerts: rowsToInsert,
        email_status: emailStatus
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
