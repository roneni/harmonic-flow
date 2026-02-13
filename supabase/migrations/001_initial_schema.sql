-- =============================================================================
-- Harmonic Flow — Initial Database Schema
-- =============================================================================

-- User profiles (extends Supabase auth.users)
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  user_tier text not null default 'free' check (user_tier in ('anonymous', 'free', 'pro')),
  stripe_customer_id text,
  playlists_optimized_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name, user_tier)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Saved playlists
create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null,
  tags text[] not null default '{}',
  original_data jsonb not null,
  optimized_data jsonb not null,
  energy_mode text not null check (energy_mode in ('ramp_up', 'ramp_down', 'wave')),
  original_score jsonb not null,
  optimized_score jsonb not null,
  improvement_percentage numeric not null default 0,
  track_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index playlists_user_id_idx on public.playlists(user_id);
create index playlists_created_at_idx on public.playlists(created_at desc);

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

alter table public.user_profiles enable row level security;
alter table public.playlists enable row level security;

-- User profiles: users can only read/update their own profile
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Playlists: users can only CRUD their own playlists
create policy "Users can view own playlists"
  on public.playlists for select
  using (auth.uid() = user_id);

create policy "Users can insert own playlists"
  on public.playlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update own playlists"
  on public.playlists for update
  using (auth.uid() = user_id);

create policy "Users can delete own playlists"
  on public.playlists for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- Updated-at trigger
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute procedure public.set_updated_at();

create trigger set_playlists_updated_at
  before update on public.playlists
  for each row execute procedure public.set_updated_at();
