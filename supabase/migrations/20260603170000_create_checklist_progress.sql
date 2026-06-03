-- Per-user checklist progress: sub-step ticks (granular %) and item-level completion (the "done?" answer).
-- Both tables use presence-as-truth (a row exists ⇒ done). Unmark = delete.

create table if not exists public.checklist_step_progress (
  user_id        uuid not null references auth.users (id) on delete cascade,
  item_id        text not null references public.checklist_items (id) on delete cascade,
  sub_step_index int  not null check (sub_step_index >= 0),
  completed_at   timestamptz not null default now(),
  primary key (user_id, item_id, sub_step_index)
);

create index if not exists checklist_step_progress_user_idx
  on public.checklist_step_progress (user_id);

comment on table public.checklist_step_progress is
  'Per-user sub-step ticks. Row presence = sub-step done. Drives the % progress bar.';

create table if not exists public.checklist_item_completion (
  user_id      uuid not null references auth.users (id) on delete cascade,
  item_id      text not null references public.checklist_items (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists checklist_item_completion_user_idx
  on public.checklist_item_completion (user_id);

comment on table public.checklist_item_completion is
  'Per-user explicit item completion. Row presence = item complete. Independent of sub-step ticks.';

-- RLS: each user can only see/insert/delete their own rows.
alter table public.checklist_step_progress enable row level security;

create policy "step_progress_select_own"
  on public.checklist_step_progress for select
  using (auth.uid() = user_id);

create policy "step_progress_insert_own"
  on public.checklist_step_progress for insert
  with check (auth.uid() = user_id);

create policy "step_progress_delete_own"
  on public.checklist_step_progress for delete
  using (auth.uid() = user_id);

alter table public.checklist_item_completion enable row level security;

create policy "item_completion_select_own"
  on public.checklist_item_completion for select
  using (auth.uid() = user_id);

create policy "item_completion_insert_own"
  on public.checklist_item_completion for insert
  with check (auth.uid() = user_id);

create policy "item_completion_delete_own"
  on public.checklist_item_completion for delete
  using (auth.uid() = user_id);
