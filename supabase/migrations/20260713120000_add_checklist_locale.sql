-- Locale-specific checklist content (one row per business id + locale).
-- Progress tables keep referencing stable business ids only (no locale).
--
-- Safe to re-run: drops BOTH the original id-only FKs and any composite
-- (id, locale) FKs from a partial previous attempt before changing the PK.

-- ── 1. Drop ALL FKs that reference checklist_items (old + new) ───────────────

alter table public.checklist_step_progress
  drop constraint if exists checklist_step_progress_item_id_fkey;

alter table public.checklist_item_completion
  drop constraint if exists checklist_item_completion_item_id_fkey;

-- Original id-only FKs
alter table public.checklist_item_requirements
  drop constraint if exists checklist_item_requirements_checklist_item_id_fkey;

alter table public.checklist_item_steps_summary
  drop constraint if exists checklist_item_steps_summary_checklist_item_id_fkey;

alter table public.checklist_item_warnings
  drop constraint if exists checklist_item_warnings_checklist_item_id_fkey;

alter table public.checklist_item_links
  drop constraint if exists checklist_item_links_checklist_item_id_fkey;

alter table public.checklist_item_dependencies
  drop constraint if exists checklist_item_dependencies_checklist_item_id_fkey;

alter table public.checklist_item_dependencies
  drop constraint if exists checklist_item_dependencies_depends_on_id_fkey;

-- Composite (id, locale) FKs from a previous partial run of this migration
alter table public.checklist_item_requirements
  drop constraint if exists checklist_item_requirements_item_locale_fkey;

alter table public.checklist_item_steps_summary
  drop constraint if exists checklist_item_steps_summary_item_locale_fkey;

alter table public.checklist_item_warnings
  drop constraint if exists checklist_item_warnings_item_locale_fkey;

alter table public.checklist_item_links
  drop constraint if exists checklist_item_links_item_locale_fkey;

alter table public.checklist_item_dependencies
  drop constraint if exists checklist_item_dependencies_item_locale_fkey;

alter table public.checklist_item_dependencies
  drop constraint if exists checklist_item_dependencies_depends_on_locale_fkey;

-- ── 2. Add locale to parents, then switch PK to (id, locale) ─────────────────

alter table public.checklist_items
  add column if not exists locale text;

update public.checklist_items
set locale = 'en'
where locale is null;

alter table public.checklist_items
  alter column locale set default 'en',
  alter column locale set not null;

alter table public.checklist_items
  drop constraint if exists checklist_items_locale_check;

alter table public.checklist_items
  add constraint checklist_items_locale_check
  check (locale in ('en', 'fr'));

alter table public.checklist_items
  drop constraint if exists checklist_items_pkey;

alter table public.checklist_items
  drop constraint if exists checklist_items_slug_key;

alter table public.checklist_items
  add constraint checklist_items_pkey primary key (id, locale);

create unique index if not exists checklist_items_slug_locale_uidx
  on public.checklist_items (slug, locale);

create index if not exists checklist_items_locale_status_order_idx
  on public.checklist_items (locale, status, order_index);

comment on column public.checklist_items.locale is
  'Content language for this row. Business id (`id`) is stable across locales.';

-- Progress tables intentionally have NO FK to checklist_items so they can keep
-- using the stable business id across locales.

-- ── 3. Children: add locale, then re-attach composite FKs ─────────────────────

-- requirements
alter table public.checklist_item_requirements
  add column if not exists locale text;

update public.checklist_item_requirements
set locale = 'en'
where locale is null;

alter table public.checklist_item_requirements
  alter column locale set default 'en',
  alter column locale set not null;

alter table public.checklist_item_requirements
  drop constraint if exists checklist_item_requirements_locale_check;

alter table public.checklist_item_requirements
  add constraint checklist_item_requirements_locale_check
  check (locale in ('en', 'fr'));

alter table public.checklist_item_requirements
  add constraint checklist_item_requirements_item_locale_fkey
  foreign key (checklist_item_id, locale)
  references public.checklist_items (id, locale) on delete cascade;

-- steps_summary
alter table public.checklist_item_steps_summary
  add column if not exists locale text;

update public.checklist_item_steps_summary
set locale = 'en'
where locale is null;

alter table public.checklist_item_steps_summary
  alter column locale set default 'en',
  alter column locale set not null;

alter table public.checklist_item_steps_summary
  drop constraint if exists checklist_item_steps_summary_locale_check;

alter table public.checklist_item_steps_summary
  add constraint checklist_item_steps_summary_locale_check
  check (locale in ('en', 'fr'));

alter table public.checklist_item_steps_summary
  add constraint checklist_item_steps_summary_item_locale_fkey
  foreign key (checklist_item_id, locale)
  references public.checklist_items (id, locale) on delete cascade;

-- warnings
alter table public.checklist_item_warnings
  add column if not exists locale text;

update public.checklist_item_warnings
set locale = 'en'
where locale is null;

alter table public.checklist_item_warnings
  alter column locale set default 'en',
  alter column locale set not null;

alter table public.checklist_item_warnings
  drop constraint if exists checklist_item_warnings_locale_check;

alter table public.checklist_item_warnings
  add constraint checklist_item_warnings_locale_check
  check (locale in ('en', 'fr'));

alter table public.checklist_item_warnings
  add constraint checklist_item_warnings_item_locale_fkey
  foreign key (checklist_item_id, locale)
  references public.checklist_items (id, locale) on delete cascade;

-- links
alter table public.checklist_item_links
  add column if not exists locale text;

update public.checklist_item_links
set locale = 'en'
where locale is null;

alter table public.checklist_item_links
  alter column locale set default 'en',
  alter column locale set not null;

alter table public.checklist_item_links
  drop constraint if exists checklist_item_links_locale_check;

alter table public.checklist_item_links
  add constraint checklist_item_links_locale_check
  check (locale in ('en', 'fr'));

alter table public.checklist_item_links
  add constraint checklist_item_links_item_locale_fkey
  foreign key (checklist_item_id, locale)
  references public.checklist_items (id, locale) on delete cascade;

-- dependencies (both ends share the same locale)
alter table public.checklist_item_dependencies
  add column if not exists locale text;

update public.checklist_item_dependencies
set locale = 'en'
where locale is null;

alter table public.checklist_item_dependencies
  alter column locale set default 'en',
  alter column locale set not null;

alter table public.checklist_item_dependencies
  drop constraint if exists checklist_item_dependencies_locale_check;

alter table public.checklist_item_dependencies
  add constraint checklist_item_dependencies_locale_check
  check (locale in ('en', 'fr'));

alter table public.checklist_item_dependencies
  drop constraint if exists checklist_item_dependencies_pkey;

alter table public.checklist_item_dependencies
  add constraint checklist_item_dependencies_pkey
  primary key (checklist_item_id, depends_on_id, locale);

alter table public.checklist_item_dependencies
  add constraint checklist_item_dependencies_item_locale_fkey
  foreign key (checklist_item_id, locale)
  references public.checklist_items (id, locale) on delete cascade;

alter table public.checklist_item_dependencies
  add constraint checklist_item_dependencies_depends_on_locale_fkey
  foreign key (depends_on_id, locale)
  references public.checklist_items (id, locale) on delete restrict;
