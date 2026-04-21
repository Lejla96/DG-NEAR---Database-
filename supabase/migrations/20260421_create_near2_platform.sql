create extension if not exists "pgcrypto";

create table if not exists public.allowed_admins (
  email text primary key,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.allowed_admins (email)
values
  ('martina@redi-ngo.eu'),
  ('lejla@redi-ngo.eu')
on conflict (email) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.entrepreneurs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  surname text not null,
  phone_number text not null,
  city text not null,
  email text not null,
  business_status text not null check (business_status in ('registered', 'not_registered')),
  gender text not null check (gender in ('female', 'male', 'other')),
  age integer not null check (age between 16 and 120),
  support_services text[] not null default '{}'::text[],
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  entrepreneur_id uuid references public.entrepreneurs(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('created', 'updated', 'deleted', 'imported', 'exported', 'signed_in')),
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists entrepreneurs_city_idx on public.entrepreneurs(city);
create index if not exists entrepreneurs_gender_idx on public.entrepreneurs(gender);
create index if not exists entrepreneurs_status_idx on public.entrepreneurs(business_status);
create index if not exists entrepreneurs_services_idx on public.entrepreneurs using gin (support_services);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);
create index if not exists activity_logs_entrepreneur_id_idx on public.activity_logs(entrepreneur_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_entrepreneurs_updated_at on public.entrepreneurs;
create trigger set_entrepreneurs_updated_at
before update on public.entrepreneurs
for each row execute function public.set_updated_at();

create or replace function public.is_allowed_admin(p_email text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.allowed_admins
    where lower(email) = lower(p_email)
  );
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and public.is_allowed_admin(email)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_allowed_admin(new.email) then
    raise exception 'This user is not permitted to access the DG NEAR 2 platform.';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'admin'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = 'admin',
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.log_activity(
  p_entrepreneur_id uuid,
  p_action text,
  p_changes jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.activity_logs (entrepreneur_id, actor_id, action, changes)
  values (p_entrepreneur_id, auth.uid(), p_action, coalesce(p_changes, '{}'::jsonb));
end;
$$;

create or replace view public.activity_log_view as
select
  logs.id,
  logs.entrepreneur_id,
  case
    when e.id is not null then concat(e.name, ' ', e.surname)
    else null
  end as entrepreneur_name,
  logs.actor_id,
  profiles.email as actor_email,
  profiles.full_name as actor_name,
  logs.action,
  logs.changes,
  logs.created_at
from public.activity_logs logs
left join public.entrepreneurs e on e.id = logs.entrepreneur_id
left join public.profiles profiles on profiles.id = logs.actor_id;

alter table public.allowed_admins enable row level security;
alter table public.profiles enable row level security;
alter table public.entrepreneurs enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "Admins can view allowed admins" on public.allowed_admins;
create policy "Admins can view allowed admins"
on public.allowed_admins
for select
using (public.current_user_is_admin());

drop policy if exists "Admins can view profiles" on public.profiles;
create policy "Admins can view profiles"
on public.profiles
for select
using (public.current_user_is_admin());

drop policy if exists "Admins can update own profile" on public.profiles;
create policy "Admins can update own profile"
on public.profiles
for update
using (id = auth.uid() and public.current_user_is_admin())
with check (id = auth.uid() and public.current_user_is_admin());

drop policy if exists "Admins can view entrepreneurs" on public.entrepreneurs;
create policy "Admins can view entrepreneurs"
on public.entrepreneurs
for select
using (public.current_user_is_admin());

drop policy if exists "Admins can insert entrepreneurs" on public.entrepreneurs;
create policy "Admins can insert entrepreneurs"
on public.entrepreneurs
for insert
with check (public.current_user_is_admin());

drop policy if exists "Admins can update entrepreneurs" on public.entrepreneurs;
create policy "Admins can update entrepreneurs"
on public.entrepreneurs
for update
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "Admins can delete entrepreneurs" on public.entrepreneurs;
create policy "Admins can delete entrepreneurs"
on public.entrepreneurs
for delete
using (public.current_user_is_admin());

drop policy if exists "Admins can view activity logs" on public.activity_logs;
create policy "Admins can view activity logs"
on public.activity_logs
for select
using (public.current_user_is_admin());

drop policy if exists "Admins can insert activity logs" on public.activity_logs;
create policy "Admins can insert activity logs"
on public.activity_logs
for insert
with check (public.current_user_is_admin());
