import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const VITE_SUPABASE_URL = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const SUPABASE_SERVICE_ROLE_KEY = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

async function run() {
  console.log("Fetching edge function at:", VITE_SUPABASE_URL + '/functions/v1/generate-market-alerts');
  const res = await fetch(`${VITE_SUPABASE_URL}/functions/v1/generate-market-alerts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY || VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}
run();
