-- Enable RLS on biblioteca_juridica_duplicate and allow public read access
ALTER TABLE public.biblioteca_juridica_duplicate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to books" 
ON public.biblioteca_juridica_duplicate 
FOR SELECT 
USING (true);