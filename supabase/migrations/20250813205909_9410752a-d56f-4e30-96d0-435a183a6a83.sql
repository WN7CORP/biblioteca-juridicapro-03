-- Create book_favorites table for user favorites
CREATE TABLE IF NOT EXISTS public.book_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_ip TEXT NOT NULL,
  book_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_ip, book_id)
);

-- Create book_notes table for user notes
CREATE TABLE IF NOT EXISTS public.book_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_ip TEXT NOT NULL,
  book_id INTEGER NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.book_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for book_favorites (allow all operations for now since we're using user_ip)
CREATE POLICY "Allow all operations on book_favorites" 
ON public.book_favorites 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create policies for book_notes (allow all operations for now since we're using user_ip)
CREATE POLICY "Allow all operations on book_notes" 
ON public.book_notes 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Enable RLS on biblioteca_juridica_duplicate and allow public read access
ALTER TABLE public.biblioteca_juridica_duplicate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to books" 
ON public.biblioteca_juridica_duplicate 
FOR SELECT 
USING (true);