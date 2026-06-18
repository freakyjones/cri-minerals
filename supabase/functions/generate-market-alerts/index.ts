import { createClient } from "npm:@supabase/supabase-js@2";

const RSS_FEEDS = [
  "https://www.mining.com/feed/"
];

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Check for API key (Auth)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response("Missing Authorization header", { status: 401, headers: corsHeaders });
    }

    // 2. Fetch RSS
    const response = await fetch(RSS_FEEDS[0]);
    const xml = await response.text();
    
    // Very basic regex parsing for RSS XML
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
    const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/;

    const items = [];
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];
      const titleMatch = titleRegex.exec(itemContent);
      const descMatch = descRegex.exec(itemContent);
      
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : "";
      const description = descMatch ? (descMatch[1] || descMatch[2]) : "";
      
      // Remove HTML tags from description to save tokens
      const cleanDesc = description.replace(/<[^>]*>?/gm, '').trim().substring(0, 500);
      
      if (title) {
        items.push(`Title: ${title}\nDescription: ${cleanDesc}`);
      }
      if (items.length >= 15) break; // Limit to 15 items to save context window limits
    }

    const newsText = items.join('\n\n');

    // 3. Call Gemini API
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const prompt = `You are an elite Critical Minerals Intelligence Analyst. Your mandate is to monitor global news for early warning signals regarding critical minerals (e.g., Lithium, Cobalt, Rare Earth Elements, Nickel, Copper, Graphite) and assess their impact on global supply chains, market pricing, and geopolitical security. Your audience consists of supply chain executives and policymakers who require precise, actionable, and noise-free intelligence.

Your task is to analyze the provided recent news headlines and descriptions, and extract up to 3 major market or geopolitical alerts (e.g., supply chain disruptions, export controls, strikes, major discoveries, nationalization).

### Constraints & Instructions
- Focus strictly on events that materially impact the market or geopolitical landscape. Ignore fluff, opinion pieces, and minor corporate updates.
- Extract a maximum of 3 alerts. Choose only the most impactful events.
- If there are no significant events that meet the threshold of at least 'LOW' severity, return an empty array: []
- Provide the output as raw, valid JSON ONLY. Do not use markdown code blocks (e.g., \`\`\`json) or include any preambles, postscripts, or conversational text.

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
    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  }
]

### Input Data
Recent News:
${newsText}`;

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const geminiData = await geminiRes.json();
    const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let alerts = [];
    if (resultText) {
      alerts = JSON.parse(resultText);
    }

    if (alerts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No critical alerts found today", inserted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Insert into Supabase
    // Using Deno.env to get Supabase connection strings locally or in production
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('SUPABASE_DB_URL');
    
    // Support both the legacy Service Role key and the new JWT Signing Keys (SUPABASE_SECRET_KEYS)
    let supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const secretKeysStr = Deno.env.get('SUPABASE_SECRET_KEYS');
    
    if (secretKeysStr) {
      try {
        const keys = JSON.parse(secretKeysStr);
        // Fallback to the first available secret key in the new JSON dictionary
        if (Object.values(keys).length > 0) {
          supabaseServiceKey = Object.values(keys)[0] as string;
        }
      } catch (e) {
        console.error("Failed to parse SUPABASE_SECRET_KEYS", e);
      }
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase connection environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rowsToInsert = alerts.map((alert: { title: string; description: string; severity: string }) => ({
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      status: 'DRAFT'
    }));

    const { error: insertError } = await supabase
      .from('market_alerts')
      .insert(rowsToInsert);

    if (insertError) {
      throw new Error(`DB Insert Error: ${insertError.message}`);
    }

    // 5. Send Email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const emailTo = Deno.env.get('EMAIL_TO');
    
    let emailStatus = "Not attempted (missing API key or email)";

    if (resendApiKey && emailTo) {
      try {
        const emailHtml = alerts.map((a: { title: string; description: string; severity: string }) => 
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
            subject: `Daily Critical Minerals Alerts (${alerts.length})`,
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
        message: `Successfully inserted ${alerts.length} draft alerts`, 
        alerts,
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
