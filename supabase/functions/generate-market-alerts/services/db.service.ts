import { createClient } from "npm:@supabase/supabase-js@2";
import { logger } from "../../shared/logger.ts";

// Initialize Supabase admin client once per isolate
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
    logger.error("Failed to parse SUPABASE_SECRET_KEYS", e);
  }
}

export const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

export async function checkAndLockRun(runId: string): Promise<boolean> {
  const { data: currentRun, error: checkError } = await supabaseAdmin
    .from('generate_market_alerts_status')
    .update({ status: 'IN_PROGRESS' })
    .eq('run_id', runId)
    .eq('status', 'PENDING')
    .select('status')
    .maybeSingle();

  if (checkError) {
    throw new Error(`Run ID DB Error: ${checkError.message}`);
  }

  return !!currentRun;
}

export async function updateRunStatus(runId: string, status: string, errorMessage?: string): Promise<void> {
  const payload: any = { status, completed_at: new Date().toISOString() };
  if (errorMessage) {
    payload.error_message = errorMessage;
  }

  await supabaseAdmin
    .from('generate_market_alerts_status')
    .update(payload)
    .eq('run_id', runId);
}

export async function insertAlerts(alerts: any[]): Promise<void> {
  const rowsToInsert = alerts.map(alert => {
    // Normalization logic for confidence score
    let parsedConfidence = alert.confidenceScore;
    if (typeof parsedConfidence === 'number') {
      if (parsedConfidence <= 1) parsedConfidence = parsedConfidence * 100;
      parsedConfidence = Math.round(parsedConfidence);
    } else if (typeof parsedConfidence === 'string') {
      const num = parseFloat(parsedConfidence);
      if (!isNaN(num)) {
         parsedConfidence = num <= 1 ? Math.round(num * 100) : Math.round(num);
      } else {
         parsedConfidence = null;
      }
    }

    return {
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      status: 'DRAFT',
      confidence_score: parsedConfidence || null,
      rationale: alert.rationale || [],
      blast_radius: alert.blastRadius || null,
      disruption_multiplier: alert.disruptionMultiplier || null,
      affected_minerals: alert.affectedMinerals || null
    };
  });

  const { error } = await supabaseAdmin.from('market_alerts').insert(rowsToInsert);
  if (error) throw new Error(`DB Insert Error: ${error.message}`);
}
