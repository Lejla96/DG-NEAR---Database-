alter table public.entrepreneurs
  add column if not exists mapped boolean not null default false;
