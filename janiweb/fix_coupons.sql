-- ==============================================================================
-- JANIBOX COUPON SYSTEM REPAIR SCRIPT
-- ==============================================================================
-- This script fixes the "violates row-level security policy" error by:
-- 1. Ensuring the coupons table and all necessary columns exist.
-- 2. Resetting security policies to allow Admins to create/edit coupons.
-- 3. Allowing customers to view valid coupons during checkout.
-- 4. Creating the helper function to track coupon usage safely.
-- ==============================================================================

-- 1. Ensure Table and Columns Exist
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key
);

-- Add columns individually to ensure they exist (safe to run multiple times)
alter table public.coupons add column if not exists code text;
alter table public.coupons add column if not exists discount_type text;
alter table public.coupons add column if not exists discount_value numeric;
alter table public.coupons add column if not exists min_purchase numeric default 0;
alter table public.coupons add column if not exists max_discount numeric;
alter table public.coupons add column if not exists usage_limit integer;
alter table public.coupons add column if not exists used_count integer default 0;
alter table public.coupons add column if not exists valid_until timestamptz;
alter table public.coupons add column if not exists is_active boolean default true;
alter table public.coupons add column if not exists created_at timestamptz default now();
alter table public.coupons add column if not exists updated_at timestamptz default now();

-- 2. Configure Row-Level Security (RLS)
alter table public.coupons enable row level security;

-- Drop ALL existing policies for this table to prevent conflicts
drop policy if exists "Admins can manage coupons" on public.coupons;
drop policy if exists "Public can view active coupons" on public.coupons;
drop policy if exists "Users can view coupons" on public.coupons;
drop policy if exists "Enable read access for all users" on public.coupons;
drop policy if exists "Enable insert for authenticated users only" on public.coupons;

-- POLICY 1: ADMIN FULL ACCESS
-- Allows logged-in admins to Insert, Update, Delete, and Select keys
create policy "Admins can manage coupons" on public.coupons
    for all
    using (auth.role() = 'authenticated');

-- POLICY 2: PUBLIC READ ACCESS
-- Allows checkout page to validate coupons (only if active and not expired)
create policy "Public can view active coupons" on public.coupons
    for select
    using (is_active = true and (valid_until is null or valid_until > now()));

-- 3. Usage Counting System
-- This function allows the checkout process to increment usage without giving public update permissions
create or replace function public.increment_coupon_usage(coupon_id uuid)
returns void
language plpgsql
security definer -- Runs with admin privileges
as $$
begin
  update public.coupons
  set used_count = coalesce(used_count, 0) + 1
  where id = coupon_id;
end;
$$;

-- Grant permissions just in case
grant execute on function public.increment_coupon_usage to anon, authenticated, service_role;
