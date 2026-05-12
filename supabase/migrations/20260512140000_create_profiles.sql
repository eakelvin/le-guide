-- One row per auth user: personal, academic, and stay fields (mirrors app UserProfile).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,

  -- Personal
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text not null default '',
  country text not null default '',
  date_of_birth text not null default '',

  -- Academic
  university text not null default '',
  program text not null default '',
  student_type text not null default '',
  campus_city text not null default '',
  academic_year text not null default '',

  -- Stay in France
  already_in_france text not null default '' check (already_in_france in ('', 'yes', 'no')),
  arrival_date text not null default '',
  address_city text not null default '',
  has_accommodation text not null default '' check (has_accommodation in ('', 'yes', 'no')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_updated_at_idx on public.profiles (updated_at desc);

comment on table public.profiles is 'Student profile (personal, academic, stay) — one row per auth user.';

-- Keep updated_at fresh on change
create or replace function public.set_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);
