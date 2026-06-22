-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Add the embedding column to the market_alerts table
-- Using 768 dimensions which perfectly matches Google's text-embedding-004 model
ALTER TABLE public.market_alerts ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create a secure RPC function for the frontend to perform Semantic Search
-- We use SECURITY INVOKER so the function strictly obeys the existing RLS policies
CREATE OR REPLACE FUNCTION match_alerts(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  severity text,
  status text,
  affected_minerals text[],
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ma.id,
    ma.title,
    ma.description,
    ma.severity::text,
    ma.status::text,
    ma.affected_minerals,
    ma.created_at,
    1 - (ma.embedding <=> query_embedding) AS similarity
  FROM market_alerts ma
  -- Only return alerts that exceed the threshold and have an embedding
  WHERE ma.embedding IS NOT NULL AND 1 - (ma.embedding <=> query_embedding) > match_threshold
  ORDER BY ma.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
