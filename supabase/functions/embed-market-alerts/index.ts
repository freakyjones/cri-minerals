/* eslint-disable */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

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

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Fetch up to 50 alerts that don't have an embedding yet
    const { data: alerts, error: fetchError } = await supabaseAdmin
      .from('market_alerts')
      .select('id, title, description')
      .is('embedding', null)
      .limit(50);

    if (fetchError) throw fetchError;

    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ message: "No alerts need embedding" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    let successCount = 0;
    let lastError = null;

    // 2. Fix Serverless Timeout Risk: Generate embeddings and update them concurrently in chunks
    const chunkSize = 10;
    for (let i = 0; i < alerts.length; i += chunkSize) {
      const chunk = alerts.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (alert) => {
        const textToEmbed = `Title: ${alert.title}\nDescription: ${alert.description}`;
        
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'models/gemini-embedding-001',
              content: { parts: [{ text: textToEmbed }] },
              outputDimensionality: 768
            })
          });

          if (!response.ok) {
            throw new Error(`API Error: ${await response.text()}`);
          }

          const data = await response.json();
          const embedding = data.embedding?.values;

          if (embedding) {
            const { error: updateError } = await supabaseAdmin
              .from('market_alerts')
              .update({ embedding })
              .eq('id', alert.id);

            if (updateError) {
              console.error(`Failed to update alert ${alert.id} with embedding:`, updateError);
            } else {
              successCount++;
            }
          }
        } catch (err: any) {
          console.error(`Failed to embed alert ${alert.id}:`, err);
          lastError = err.message;
        }
      }));
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully embedded ${successCount} out of ${alerts.length} alerts`,
        lastError: lastError
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error generating embeddings:', error);
    // 3. Fix Error Swallowing: Return 500 status code on global catch
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
