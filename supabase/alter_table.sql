-- Skrip migrasi untuk menambahkan kolom kategori pada database yang sudah berjalan
-- Eksekusi skrip ini di SQL Editor Supabase untuk memperbarui tabel Anda tanpa menghapus data lama.

ALTER TABLE public.questions
ADD COLUMN exam_type text DEFAULT 'SIM C' CHECK (exam_type IN ('SIM A', 'SIM C')),
ADD COLUMN material_category text DEFAULT 'Pengetahuan' CHECK (material_category IN ('Persepsi Bahaya', 'Wawasan', 'Pengetahuan'));

ALTER TABLE public.test_results
ADD COLUMN exam_type_taken text DEFAULT 'SIM C' CHECK (exam_type_taken IN ('SIM A', 'SIM C'));
