create extension if not exists "pgcrypto";
create extension if not exists "citext";

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  customer_email citext not null,
  customer_name text not null,
  customer_phone text not null,
  subtotal_amount numeric(12, 2) not null check (subtotal_amount >= 0),
  shipping_amount numeric(12, 2) not null default 0 check (shipping_amount >= 0),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  currency text not null default 'USD',
  delivery_address jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

-- Catalog products stay in JSON. This table stores the purchased product snapshot per order.
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_slug text not null,
  product_name text not null,
  product_description text not null,
  product_category_slug text not null,
  product_category_name text not null,
  product_image_url text,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12, 2) generated always as (unit_price * quantity) stored,
  product_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists customers_email_idx on public.customers(email);
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_customer_email_idx on public.orders(customer_email);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- No public policies yet. Inserts are performed only by the Next.js server using SUPABASE_SERVICE_ROLE_KEY.
