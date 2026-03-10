-- File untuk dieksekusi di Supabase SQL Editor oleh Administrator
-- Berfungsi untuk menampung kritik, saran, atau laporan salah ketik soal dari peserta

CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text REFERENCES public.users(email) ON DELETE SET NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public to insert feedback (anyone who has done the quiz)
CREATE POLICY "Allow public insert to feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Only authenticated admins can read feedback
CREATE POLICY "Allow authenticated read feedback" ON public.feedback
  FOR SELECT TO authenticated USING (true);
