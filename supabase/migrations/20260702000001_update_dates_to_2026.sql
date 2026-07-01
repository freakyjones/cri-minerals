-- Update mineral_data_sources to reflect 2026 data
UPDATE public.mineral_data_sources
SET label = REPLACE(label, '2024', '2026');

UPDATE public.mineral_data_sources
SET label = REPLACE(label, '2023', '2025');

-- Update mineral_timeline to shift recent events to 2026
UPDATE public.mineral_timeline
SET year = 2026
WHERE year = 2024;

UPDATE public.mineral_timeline
SET year = 2025
WHERE year = 2023;
