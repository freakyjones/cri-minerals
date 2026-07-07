export const RSS_FEEDS = [
  "https://www.mining.com/feed/"
];

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, trace_id, idempotency-key',
};

// LLM Settings
export const MODELS_TO_TRY = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-3.1-pro-preview"];
export const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// GDELT Settings
export const GDELT_QUERY = '("critical minerals" OR lithium OR cobalt OR nickel OR graphite) AND (strike OR ban OR tariff OR delay OR war OR sanctions OR discovery)';
export const GDELT_URL = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(GDELT_QUERY)}&mode=artlist&format=json&maxrecords=15`;
