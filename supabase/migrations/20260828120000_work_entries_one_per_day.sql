-- One work entry per user per calendar day (dedupe existing rows first).

delete from public.work_entries
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by user_id, work_date
        order by updated_at desc, created_at desc
      ) as rn
    from public.work_entries
  ) ranked
  where rn > 1
);

alter table public.work_entries
  add constraint work_entries_user_date_unique unique (user_id, work_date);
