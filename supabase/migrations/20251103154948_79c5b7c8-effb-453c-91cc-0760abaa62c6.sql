-- Create table for storing URL check results
CREATE TABLE IF NOT EXISTS public.url_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('safe', 'phishing')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  reasons JSONB,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_url_checks_checked_at ON public.url_checks(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_url_checks_verdict ON public.url_checks(verdict);

-- Enable Row Level Security
ALTER TABLE public.url_checks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read (for public phishing checker)
CREATE POLICY "Allow public read access" 
ON public.url_checks 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert (for public phishing checker)
CREATE POLICY "Allow public insert access" 
ON public.url_checks 
FOR INSERT 
WITH CHECK (true);