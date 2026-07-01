import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('SUPABASE_DB_URL');
    let supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Quick auth check - this is meant to be run via cron (pg_net) or authenticated admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response("Missing Authorization header", { status: 401, headers: corsHeaders });
    }
    const token = authHeader.replace('Bearer ', '');
    
    const secretKeysStr = Deno.env.get('SUPABASE_SECRET_KEYS');
    if (secretKeysStr) {
      try {
        const keys = JSON.parse(secretKeysStr);
        if (Object.values(keys).length > 0) {
          supabaseServiceKey = Object.values(keys)[0] as string;
        }
      } catch (e) {
        console.error("Failed to parse keys", e);
      }
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Validate the token (only allow if it's the service key or an admin user)
    if (token !== supabaseServiceKey) {
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !user || user.app_metadata?.role !== 'admin') {
        return new Response("Unauthorized - Admin access required", { status: 401, headers: corsHeaders });
      }
    }

    // In a real production scenario, this would query the USGS MRDS API.
    // For this MVP, we simulate fetching the latest geological reports for all 21 key minerals in our DB.
    console.log("Fetching latest USGS Geological Data...");
    
    // Mocked USGS response mapping - EXPANDED with price, recycling, and top producers
    const usgsData = [
      { slug: 'lithium', global_reserves_mt: 26000000, annual_production_mt: 130000, recycling_rate: 6, current_price_usd: 15400, top_producers: [{ country: 'Australia', share: 47, amount_mt: 61100 }, { country: 'Chile', share: 30, amount_mt: 39000 }, { country: 'China', share: 15, amount_mt: 19500 }] },
      { slug: 'cobalt', global_reserves_mt: 8300000, annual_production_mt: 190000, recycling_rate: 30, current_price_usd: 28500, top_producers: [{ country: 'DRC', share: 68, amount_mt: 129200 }, { country: 'Indonesia', share: 10, amount_mt: 19000 }, { country: 'Russia', share: 4, amount_mt: 7600 }] },
      { slug: 'nickel', global_reserves_mt: 100000000, annual_production_mt: 3300000, recycling_rate: 45, current_price_usd: 16800, top_producers: [{ country: 'Indonesia', share: 48, amount_mt: 1584000 }, { country: 'Philippines', share: 10, amount_mt: 330000 }, { country: 'Russia', share: 7, amount_mt: 231000 }] },
      { slug: 'graphite', global_reserves_mt: 330000000, annual_production_mt: 1300000, recycling_rate: 1, current_price_usd: 850, top_producers: [{ country: 'China', share: 65, amount_mt: 845000 }, { country: 'Mozambique', share: 13, amount_mt: 169000 }, { country: 'Madagascar', share: 8, amount_mt: 104000 }] },
      { slug: 'copper', global_reserves_mt: 890000000, annual_production_mt: 22000000, recycling_rate: 32, current_price_usd: 8450, top_producers: [{ country: 'Chile', share: 24, amount_mt: 5280000 }, { country: 'Peru', share: 10, amount_mt: 2200000 }, { country: 'DRC', share: 10, amount_mt: 2200000 }] },
      { slug: 'rare-earth-elements', global_reserves_mt: 130000000, annual_production_mt: 300000, recycling_rate: 1, current_price_usd: 62000, top_producers: [{ country: 'China', share: 70, amount_mt: 210000 }, { country: 'USA', share: 14, amount_mt: 42000 }, { country: 'Australia', share: 6, amount_mt: 18000 }] },
      { slug: 'manganese', global_reserves_mt: 1700000000, annual_production_mt: 20000000, recycling_rate: 35, current_price_usd: 1200, top_producers: [{ country: 'South Africa', share: 36, amount_mt: 7200000 }, { country: 'Gabon', share: 23, amount_mt: 4600000 }, { country: 'Australia', share: 16, amount_mt: 3200000 }] },
      { slug: 'silicon', global_reserves_mt: 1500000000, annual_production_mt: 8500000, recycling_rate: 15, current_price_usd: 2100, top_producers: [{ country: 'China', share: 71, amount_mt: 6035000 }, { country: 'Russia', share: 7, amount_mt: 595000 }, { country: 'Brazil', share: 5, amount_mt: 425000 }] },
      { slug: 'gallium', global_reserves_mt: 320000, annual_production_mt: 550, recycling_rate: 5, current_price_usd: 450, top_producers: [{ country: 'China', share: 98, amount_mt: 539 }, { country: 'Russia', share: 1, amount_mt: 5 }, { country: 'Japan', share: 1, amount_mt: 5 }] },
      { slug: 'germanium', global_reserves_mt: 500000, annual_production_mt: 180, recycling_rate: 30, current_price_usd: 1250, top_producers: [{ country: 'China', share: 60, amount_mt: 108 }, { country: 'Russia', share: 10, amount_mt: 18 }, { country: 'USA', share: 5, amount_mt: 9 }] },
      { slug: 'tungsten', global_reserves_mt: 3800000, annual_production_mt: 84000, recycling_rate: 40, current_price_usd: 32000, top_producers: [{ country: 'China', share: 84, amount_mt: 70560 }, { country: 'Vietnam', share: 6, amount_mt: 5040 }, { country: 'Russia', share: 3, amount_mt: 2520 }] },
      { slug: 'titanium', global_reserves_mt: 750000000, annual_production_mt: 9200000, recycling_rate: 45, current_price_usd: 8500, top_producers: [{ country: 'China', share: 37, amount_mt: 3404000 }, { country: 'Mozambique', share: 13, amount_mt: 1196000 }, { country: 'South Africa', share: 10, amount_mt: 920000 }] },
      { slug: 'antimony', global_reserves_mt: 1500000, annual_production_mt: 110000, recycling_rate: 28, current_price_usd: 12500, top_producers: [{ country: 'China', share: 55, amount_mt: 60500 }, { country: 'Russia', share: 22, amount_mt: 24200 }, { country: 'Tajikistan', share: 15, amount_mt: 16500 }] },
      { slug: 'platinum-group-metals', global_reserves_mt: 71000, annual_production_mt: 400, recycling_rate: 40, current_price_usd: 28000, top_producers: [{ country: 'South Africa', share: 70, amount_mt: 280 }, { country: 'Russia', share: 15, amount_mt: 60 }, { country: 'Zimbabwe', share: 7, amount_mt: 28 }] },
      { slug: 'vanadium', global_reserves_mt: 26000000, annual_production_mt: 110000, recycling_rate: 40, current_price_usd: 26500, top_producers: [{ country: 'China', share: 64, amount_mt: 70400 }, { country: 'Russia', share: 18, amount_mt: 19800 }, { country: 'South Africa', share: 8, amount_mt: 8800 }] },
      { slug: 'bismuth', global_reserves_mt: 370000, annual_production_mt: 20000, recycling_rate: 5, current_price_usd: 8100, top_producers: [{ country: 'China', share: 80, amount_mt: 16000 }, { country: 'Laos', share: 10, amount_mt: 2000 }, { country: 'Mexico', share: 2, amount_mt: 400 }] },
      { slug: 'niobium', global_reserves_mt: 17000000, annual_production_mt: 73000, recycling_rate: 20, current_price_usd: 45000, top_producers: [{ country: 'Brazil', share: 88, amount_mt: 64240 }, { country: 'Canada', share: 10, amount_mt: 7300 }, { country: 'Others', share: 2, amount_mt: 1460 }] },
      { slug: 'tantalum', global_reserves_mt: 140000, annual_production_mt: 2100, recycling_rate: 20, current_price_usd: 150000, top_producers: [{ country: 'DRC', share: 41, amount_mt: 861 }, { country: 'Rwanda', share: 21, amount_mt: 441 }, { country: 'Brazil', share: 18, amount_mt: 378 }] },
      { slug: 'beryllium', global_reserves_mt: 100000, annual_production_mt: 260, recycling_rate: 10, current_price_usd: 600000, top_producers: [{ country: 'USA', share: 65, amount_mt: 169 }, { country: 'China', share: 25, amount_mt: 65 }, { country: 'Kazakhstan', share: 10, amount_mt: 26 }] },
      { slug: 'chromium', global_reserves_mt: 570000000, annual_production_mt: 41000000, recycling_rate: 35, current_price_usd: 9500, top_producers: [{ country: 'South Africa', share: 44, amount_mt: 18040000 }, { country: 'Kazakhstan', share: 17, amount_mt: 6970000 }, { country: 'India', share: 10, amount_mt: 4100000 }] },
      { slug: 'tin', global_reserves_mt: 4600000, annual_production_mt: 310000, recycling_rate: 30, current_price_usd: 25000, top_producers: [{ country: 'China', share: 31, amount_mt: 96100 }, { country: 'Indonesia', share: 24, amount_mt: 74400 }, { country: 'Myanmar', share: 15, amount_mt: 46500 }] }
    ];

    // Single network call to RPC for atomic upserts
    const { error: rpcError } = await supabaseAdmin.rpc('sync_usgs_mineral_data', { payload: usgsData });

    if (rpcError) {
      console.error(`Failed to execute sync_usgs_mineral_data RPC`, rpcError);
      throw rpcError;
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully synchronized USGS data for ${usgsData.length} minerals`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
