create or replace function public.is_allowed_admin(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
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
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and lower(email) in (
        select lower(email)
        from public.allowed_admins
      )
  );
$$;
