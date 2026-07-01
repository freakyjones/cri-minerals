-- Add price column
ALTER TABLE public.minerals
ADD COLUMN current_price_usd NUMERIC;

-- Create RPC for atomic syncing of USGS data
CREATE OR REPLACE FUNCTION public.sync_usgs_mineral_data(payload JSON)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    mineral_data RECORD;
    producer_data RECORD;
    v_mineral_id UUID;
BEGIN
    FOR mineral_data IN SELECT * FROM json_array_elements(payload)
    LOOP
        -- Update minerals table
        UPDATE public.minerals
        SET 
            global_reserves_mt = (mineral_data.value->>'global_reserves_mt')::NUMERIC,
            annual_production_mt = (mineral_data.value->>'annual_production_mt')::NUMERIC,
            recycling_rate = (mineral_data.value->>'recycling_rate')::NUMERIC,
            current_price_usd = (mineral_data.value->>'current_price_usd')::NUMERIC,
            last_usgs_sync = NOW()
        WHERE slug = mineral_data.value->>'slug'
        RETURNING id INTO v_mineral_id;

        IF v_mineral_id IS NOT NULL THEN
            -- Delete old producers
            DELETE FROM public.mineral_production WHERE mineral_id = v_mineral_id;
            
            -- Insert new producers
            FOR producer_data IN SELECT * FROM json_array_elements(mineral_data.value->'top_producers')
            LOOP
                INSERT INTO public.mineral_production (mineral_id, country, share, amount_mt)
                VALUES (
                    v_mineral_id,
                    producer_data.value->>'country',
                    (producer_data.value->>'share')::NUMERIC,
                    (producer_data.value->>'amount_mt')::NUMERIC
                );
            END LOOP;
        END IF;
    END LOOP;
END;
$$;
