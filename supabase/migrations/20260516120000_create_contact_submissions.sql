create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

comment on table public.contact_submissions is 'Messages from the public contact form.';

alter table public.contact_submissions enable row level security;

-- Inserts only (via server action); no public reads
create policy "contact_submissions_insert"
  on public.contact_submissions for insert
  with check (true);
