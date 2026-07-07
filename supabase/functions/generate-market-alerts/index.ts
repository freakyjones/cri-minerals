/* eslint-disable */
import { logger } from "../shared/logger.ts";
import { CORS_HEADERS } from "./config/index.ts";
import { checkAndLockRun, updateRunStatus, insertAlerts } from "./services/db.service.ts";
import { fetchNewsData } from "./services/fetcher.service.ts";
import { generateAlertsFromNews } from "./services/llm.service.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  let runId: string | null = null;
  const traceId = req.headers.get('trace_id') || 'unknown';
  const idempotencyKey = req.headers.get('idempotency-key');

  try {
    const payload = await req.json();
    runId = payload.record?.run_id;

    if (!runId) {
      return new Response("Missing run_id in payload", { status: 400, headers: CORS_HEADERS });
    }

    const childLogger = logger.child({ runId, traceId });
    if (idempotencyKey) {
       childLogger.info("Processing with Idempotency Key", { idempotencyKey });
    }

    // 1. Lock the Run
    const locked = await checkAndLockRun(runId);
    if (!locked) {
      childLogger.info("Run already processed or in progress");
      return new Response(
        JSON.stringify({ message: "Run already processed or in progress", run_id: runId }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch Aggregated News Data
    const newsText = await fetchNewsData(childLogger);

    if (newsText.trim() === '') {
      childLogger.warn("No news fetched from GDELT or RSS. Skipping Gemini call.");
      await updateRunStatus(runId, 'COMPLETED');
      return new Response(
        JSON.stringify({ message: "No news articles found. Completed successfully.", run_id: runId }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // 3. Process with LLM
    const validAlerts = await generateAlertsFromNews(newsText, childLogger);

    // 4. Save to Database
    if (validAlerts.length > 0) {
      await insertAlerts(validAlerts);
    }

    // 5. Update Status
    await updateRunStatus(runId, 'COMPLETED');
    childLogger.info("Successfully completed market alert generation", { alertsFound: validAlerts.length });

    return new Response(
      JSON.stringify({ message: "Successfully completed", run_id: runId }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    logger.error("Error in generate-market-alerts", error, { runId, traceId: req.headers.get('trace_id') });
    
    if (runId) {
      await updateRunStatus(runId, 'FAILED', error.message);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } finally {
    await logger.flush();
  }
});
