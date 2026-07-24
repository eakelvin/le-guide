-- Create a profiles row from auth metadata on signup (email confirm or immediate session).
-- Copies first_name, last_name, email, country, university from user_metadata.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  meta_country text := coalesce(nullif(trim(meta->>'country'), ''), nullif(trim(meta->>'nationality'), ''), '');
  meta_university text := coalesce(nullif(trim(meta->>'university'), ''), '');
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    country,
    university
  )
  values (
    new.id,
    coalesce(nullif(trim(meta->>'first_name'), ''), ''),
    coalesce(nullif(trim(meta->>'last_name'), ''), ''),
    coalesce(new.email, ''),
    meta_country,
    meta_university
  )
  on conflict (id) do update set
    first_name = case
      when public.profiles.first_name = '' then excluded.first_name
      else public.profiles.first_name
    end,
    last_name = case
      when public.profiles.last_name = '' then excluded.last_name
      else public.profiles.last_name
    end,
    email = case
      when public.profiles.email = '' then excluded.email
      else public.profiles.email
    end,
    country = case
      when public.profiles.country = '' then excluded.country
      else public.profiles.country
    end,
    university = case
      when public.profiles.university = '' then excluded.university
      else public.profiles.university
    end,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on function public.handle_new_user() is
  'Seeds public.profiles from auth.users metadata (name, email, country, university) on signup.';
