-- Per-user work hours log for the Boulot (pointeuse) feature.

create table if not exists public.work_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  work_date date not null,
  start_time text,
  end_time text,
  hours numeric(6, 2),
  break_minutes int not null default 0 check (break_minutes >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint work_entries_hours_or_times check (
    (hours is not null and hours >= 0)
    or (start_time is not null and end_time is not null)
  )
);

create index if not exists work_entries_user_date_idx
  on public.work_entries (user_id, work_date desc);

comment on table public.work_entries is
  'Per-user work day entries for the Boulot hours tracker.';

create or replace function public.set_work_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists work_entries_set_updated_at on public.work_entries;
create trigger work_entries_set_updated_at
  before update on public.work_entries
  for each row execute function public.set_work_entries_updated_at();

alter table public.work_entries enable row level security;

create policy "work_entries_select_own"
  on public.work_entries for select
  using (auth.uid() = user_id);

create policy "work_entries_insert_own"
  on public.work_entries for insert
  with check (auth.uid() = user_id);

create policy "work_entries_update_own"
  on public.work_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "work_entries_delete_own"
  on public.work_entries for delete
  using (auth.uid() = user_id);
