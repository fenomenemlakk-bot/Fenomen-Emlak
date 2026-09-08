-- Fenomen Emlak - İlan fotoğrafları için depolama alanı (Storage Bucket)
-- Bunu Supabase SQL Editor'de çalıştır.

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;
