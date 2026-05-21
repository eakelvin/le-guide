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
  applies_to_student_groups text[] not null default '{}'
    check (applies_to_student_groups <@ array['eu_students', 'non_eu_students']),
  applies_to_visa_types text[] not null default '{}'
    check (applies_to_visa_types <@ array['long_stay', 'short_stay', 'none']),
  deadline text,
  last_verified_at date,
  order_index int not null default 0,
  common_options text[] not null default '{}',
  recommended_timing text,
  why_this_matters text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index checklist_items_category_idx on public.checklist_items (category);
create index checklist_items_order_index_idx on public.checklist_items (category, order_index);

comment on table public.checklist_items is 'Student admin checklist definitions (visa, CAF, etc.).';
comment on column public.checklist_items.applies_to_student_groups is 'Subset of {eu_students, non_eu_students}.';
comment on column public.checklist_items.applies_to_visa_types is 'Subset of {long_stay, short_stay, none}.';

create table public.checklist_item_requirements (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id text not null references public.checklist_items (id) on delete cascade,
  name text not null,
  required boolean not null default true,
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

create table public.checklist_item_warnings (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id text not null references public.checklist_items (id) on delete cascade,
  warning text not null,
  sort_order int not null default 0
);

create index checklist_item_warnings_item_idx
  on public.checklist_item_warnings (checklist_item_id, sort_order);

comment on table public.checklist_item_warnings is 'Ordered warnings shown on a checklist item.';

create table public.checklist_item_links (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id text not null references public.checklist_items (id) on delete cascade,
  label text not null,
  url text not null,
  sort_order int not null default 0
);

create index checklist_item_links_item_idx
  on public.checklist_item_links (checklist_item_id, sort_order);

create table public.checklist_item_dependencies (
  checklist_item_id text not null references public.checklist_items (id) on delete cascade,
  depends_on_id     text not null references public.checklist_items (id) on delete restrict,
  sort_order int not null default 0,
  primary key (checklist_item_id, depends_on_id),
  check (checklist_item_id <> depends_on_id)
);

create index checklist_item_dependencies_depends_on_idx
  on public.checklist_item_dependencies (depends_on_id);

comment on table public.checklist_item_dependencies is
  'Ordered prerequisites: a row (a, b) means item a depends on item b. Cycles are not enforced at the DB level — guard against them in the seed/app layer.';

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
alter table public.checklist_item_warnings enable row level security;
alter table public.checklist_item_links enable row level security;
alter table public.checklist_item_dependencies enable row level security;

create policy "checklist_items_select_all"
  on public.checklist_items for select
  using (true);

create policy "checklist_item_requirements_select_all"
  on public.checklist_item_requirements for select
  using (true);

create policy "checklist_item_steps_summary_select_all"
  on public.checklist_item_steps_summary for select
  using (true);

create policy "checklist_item_warnings_select_all"
  on public.checklist_item_warnings for select
  using (true);

create policy "checklist_item_links_select_all"
  on public.checklist_item_links for select
  using (true);

create policy "checklist_item_dependencies_select_all"
  on public.checklist_item_dependencies for select
  using (true);
