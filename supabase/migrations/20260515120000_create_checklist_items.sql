-- Administrative checklist items (visa, housing, etc.) — reference content, not per-user progress.

create type public.checklist_difficulty as enum ('easy', 'medium', 'hard');
create type public.checklist_priority as enum ('low', 'medium', 'high');

create table public.checklist_items (
  id text primary key,
  slug text not null unique,
  title text not null,
  short_description text not null,
  category text not null,
  estimated_time text,
  difficulty public.checklist_difficulty not null,
  priority public.checklist_priority not null,
  is_required boolean not null default false,
  applies_to_non_eu_students boolean not null default false,
  applies_to_eu_students boolean not null default false,
  deadline text,
  order_index int not null default 0,
  common_options text[] not null default '{}',
  recommended_timing text,
  warning text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index checklist_items_category_idx on public.checklist_items (category);
create index checklist_items_order_index_idx on public.checklist_items (category, order_index);

comment on table public.checklist_items is 'Student admin checklist definitions (visa, CAF, etc.).';

create table public.checklist_item_requirements (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id text not null references public.checklist_items (id) on delete cascade,
  requirement text not null,
  sort_order int not null default 0
);

create index checklist_item_requirements_item_idx
  on public.checklist_item_requirements (checklist_item_id, sort_order);

create table public.checklist_item_steps_summary (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id text not null references public.checklist_items (id) on delete cascade,
  summary text not null,
  sort_order int not null default 0
);

create index checklist_item_steps_summary_item_idx
  on public.checklist_item_steps_summary (checklist_item_id, sort_order);

comment on table public.checklist_item_steps_summary is 'Ordered step-by-step guidance for a checklist item.';

create table public.checklist_item_links (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id text not null references public.checklist_items (id) on delete cascade,
  label text not null,
  url text not null,
  sort_order int not null default 0
);

create index checklist_item_links_item_idx
  on public.checklist_item_links (checklist_item_id, sort_order);

-- updated_at on checklist_items
create or replace function public.set_checklist_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger checklist_items_set_updated_at
  before update on public.checklist_items
  for each row execute function public.set_checklist_items_updated_at();

-- RLS: public read, no client writes (seed via migrations / service role)
alter table public.checklist_items enable row level security;
alter table public.checklist_item_requirements enable row level security;
alter table public.checklist_item_steps_summary enable row level security;
alter table public.checklist_item_links enable row level security;

create policy "checklist_items_select_all"
  on public.checklist_items for select
  using (true);

create policy "checklist_item_requirements_select_all"
  on public.checklist_item_requirements for select
  using (true);

create policy "checklist_item_steps_summary_select_all"
  on public.checklist_item_steps_summary for select
  using (true);

create policy "checklist_item_links_select_all"
  on public.checklist_item_links for select
  using (true);
