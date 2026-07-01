alter table public.checklist_item_steps_summary
  add column description text;

comment on column public.checklist_item_steps_summary.description is
  'Optional short clarification shown below the step summary.';
