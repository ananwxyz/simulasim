-- Buat bucket storage 'media' jika belum ada
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- Hapus policy lama jika ada (mencegah error saat run berulang)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Admin Upload" on storage.objects;
drop policy if exists "Admin Delete" on storage.objects;

-- Set policy agar publik bisa baca gambar yang diupload
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'media' );

-- Set policy agar admin (authenticated) bisa upload/insert
create policy "Admin Upload" 
on storage.objects for insert 
with check ( bucket_id = 'media' and auth.role() = 'authenticated' );

-- Set policy agar admin (authenticated) bisa delete
create policy "Admin Delete" 
on storage.objects for delete 
using ( bucket_id = 'media' and auth.role() = 'authenticated' );
