create extension if not exists "pgcrypto";

alter table public.orders
add column if not exists confirmation_token text;

do $$
declare
  gen_random_bytes_schema text;
begin
  select n.nspname
  into gen_random_bytes_schema
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where p.proname = 'gen_random_bytes'
  limit 1;

  if gen_random_bytes_schema is not null then
    execute format(
      'update public.orders set confirmation_token = encode(%I.gen_random_bytes(32), ''hex'') where confirmation_token is null',
      gen_random_bytes_schema
    );
  else
    update public.orders
    set confirmation_token = md5(random()::text || clock_timestamp()::text || id::text) || md5(random()::text || clock_timestamp()::text || id::text)
    where confirmation_token is null;
  end if;
end $$;

alter table public.orders
alter column confirmation_token set not null;

create unique index if not exists orders_confirmation_token_idx
on public.orders(confirmation_token);
