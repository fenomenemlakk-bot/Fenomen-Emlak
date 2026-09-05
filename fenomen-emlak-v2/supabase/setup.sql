-- Fenomen Emlak - Supabase kurulum betiği
-- Bunu Supabase panelinde "SQL Editor" bölümüne yapıştırıp "Run" ile çalıştır.

create table if not exists properties (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Row Level Security açık, herhangi bir "public" politika eklemiyoruz.
-- Böylece bu tablolara SADECE sunucu tarafındaki (Vercel API fonksiyonları
-- içindeki) gizli "service role" anahtarıyla erişilebilir; tarayıcıdan
-- doğrudan kimse okuyup yazamaz.
alter table properties enable row level security;
alter table inquiries enable row level security;
