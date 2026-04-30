create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price_eur numeric(10,2) not null check (price_eur >= 0),
  quantity integer not null default 0 check (quantity >= 0),
  image_path text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'ordered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  total_eur numeric(10,2) not null check (total_eur >= 0),
  status text not null default 'created' check (status in ('created', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_eur numeric(10,2) not null check (unit_price_eur >= 0),
  quantity integer not null check (quantity > 0),
  image_path text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_carts_updated_at on public.carts;
create trigger trg_carts_updated_at
before update on public.carts
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_cart_items_updated_at on public.cart_items;
create trigger trg_cart_items_updated_at
before update on public.cart_items
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, role)
  values (
    new.id,
    coalesce(new.email, ''),
    case
      when lower(coalesce(new.email, '')) = lower(coalesce(current_setting('app.admin_email', true), ''))
      then 'admin'
      else 'client'
    end
  )
  on conflict (user_id) do update
  set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.profiles p
    where p.user_id = $1 and p.role = 'admin'
  );
$$;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read"
on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists "products published read" on public.products;
create policy "products published read"
on public.products
for select
using (published = true or public.is_admin(auth.uid()));

drop policy if exists "products admin write" on public.products;
create policy "products admin write"
on public.products
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "carts own all" on public.carts;
create policy "carts own all"
on public.carts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "cart items own all" on public.cart_items;
create policy "cart items own all"
on public.cart_items
for all
using (
  exists (
    select 1 from public.carts c
    where c.id = cart_id and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.carts c
    where c.id = cart_id and c.user_id = auth.uid()
  )
);

drop policy if exists "orders own read create" on public.orders;
create policy "orders own read create"
on public.orders
for all
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "order items own read create" on public.order_items;
create policy "order items own read create"
on public.order_items
for all
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
)
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

create or replace function public.checkout_cart()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_cart_id uuid;
  v_order_id uuid;
  v_total numeric(10,2);
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  select id into v_cart_id
  from public.carts
  where user_id = v_user_id and status = 'active'
  for update;

  if v_cart_id is null then
    raise exception 'CART_NOT_FOUND';
  end if;

  if not exists (select 1 from public.cart_items where cart_id = v_cart_id) then
    raise exception 'CART_EMPTY';
  end if;

  if exists (
    select 1
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.cart_id = v_cart_id and p.quantity < ci.quantity
  ) then
    raise exception 'INSUFFICIENT_STOCK';
  end if;

  select coalesce(sum(ci.quantity * p.price_eur), 0)::numeric(10,2)
  into v_total
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.cart_id = v_cart_id;

  insert into public.orders (user_id, total_eur, status)
  values (v_user_id, v_total, 'created')
  returning id into v_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    unit_price_eur,
    quantity,
    image_path
  )
  select
    v_order_id,
    p.id,
    p.name,
    p.price_eur,
    ci.quantity,
    p.image_path
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.cart_id = v_cart_id;

  update public.products p
  set quantity = p.quantity - ci.quantity
  from public.cart_items ci
  where ci.cart_id = v_cart_id and ci.product_id = p.id;

  delete from public.cart_items where cart_id = v_cart_id;

  return v_order_id;
end;
$$;

revoke all on function public.checkout_cart() from public;
grant execute on function public.checkout_cart() to authenticated;
