-- Guide posts (editorial + checklist-linked), bilingual via (slug, locale).
-- Sections stored as JSONB to match BlogPost.sections shape.
-- Seed from lib/data/guides.en.json / guides.fr.json via scripts/seed-guides.ts.

create table if not exists public.guide_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null check (locale in ('en', 'fr')),
  kind text not null check (kind in ('editorial', 'checklist')),
  title text not null,
  excerpt text not null,
  category text not null,
  reading_minutes integer not null default 1,
  updated_on date not null,
  sections jsonb not null default '[]'::jsonb,
  recommendation text,
  warning text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

create index if not exists guide_posts_locale_kind_idx
  on public.guide_posts (locale, kind);

create index if not exists guide_posts_locale_category_idx
  on public.guide_posts (locale, category);

alter table public.guide_posts enable row level security;

drop policy if exists "guide_posts_public_read" on public.guide_posts;
create policy "guide_posts_public_read"
  on public.guide_posts
  for select
  to anon, authenticated
  using (true);

comment on table public.guide_posts is
  'Localized guide articles. Source of truth for seeding: lib/data/guides.{en,fr}.json';
