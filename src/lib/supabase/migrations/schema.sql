-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Consolidated from 001, 003, and schema.sql)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  -- Profile Info
  nickname text not null,
  full_name text,
  bio text,

  -- Media
  avatar_url text,
  banner_url text,

  -- Onboarding Status
  onboarding_completed boolean default false,
  onboarding_completed_at timestamp with time zone,

  -- Preferences & Settings
  account_type text default 'free', -- free, pro, premium
  status text default 'active', -- active, inactive, suspended, deleted
  language text default 'en',
  timezone text default 'UTC',
  theme text default 'light', -- light, dark, auto

  -- Privacy
  is_public boolean default true,
  allow_messages boolean default true,
  show_email boolean default false,

  -- Contact
  website_url text,
  twitter_url text,
  github_url text,
  linkedin_url text,

  -- Stats
  total_posts int default 0,
  total_followers int default 0,
  total_following int default 0,

  -- Timestamps
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),

  -- Metadata
  metadata jsonb
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Indexes for profiles
create index if not exists profiles_nickname_idx on public.profiles(nickname);
create index if not exists profiles_status_idx on public.profiles(status);
create index if not exists profiles_account_type_idx on public.profiles(account_type);
create index if not exists profiles_created_at_idx on public.profiles(onboarding_completed_at desc);
create index if not exists profiles_is_public_idx on public.profiles(is_public);

-- Policies for profiles (Optimized)
drop policy if exists "Profiles are viewable by owner or if public" on public.profiles;
create policy "Profiles are viewable by owner or if public" on public.profiles
  for select using (
    (select auth.uid()) = id or is_public = true
  );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check ((select auth.uid()) = id);

-- Trigger to auto-update updated_at for profiles
create or replace function update_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at_trigger on public.profiles;
create trigger profiles_updated_at_trigger
before update on public.profiles
for each row
execute function update_profiles_updated_at();

-- Trigger to auto-create profile on new user signup (from 003)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    nickname,
    full_name,
    avatar_url,
    onboarding_completed,
    created_at
  ) values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1),
      'User'
    ),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    false,
    now()
  );
  return new;
exception
  when unique_violation then
    -- Profile already exists, ignore
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- POMODORO SESSIONS
create table if not exists public.pomodoro_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mode text check (mode in ('focus', 'shortBreak', 'longBreak')) not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  duration_minutes int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pomodoro_sessions enable row level security;

-- Optimized Policies for pomodoro_sessions
drop policy if exists "Users can view their own sessions" on public.pomodoro_sessions;
create policy "Users can view their own sessions"
  on public.pomodoro_sessions for select
  using ( (select auth.uid()) = user_id );

drop policy if exists "Users can insert their own sessions" on public.pomodoro_sessions;
create policy "Users can insert their own sessions"
  on public.pomodoro_sessions for insert
  with check ( (select auth.uid()) = user_id );


-- TASKS
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  status text default 'todo' check (status in ('todo', 'in_progress', 'done')),
  estimated_pomodoros int default 1,
  actual_pomodoros int default 0,
  created_at timestamp with time zone default now()
);

alter table public.tasks enable row level security;

-- Optimized Policies for tasks
drop policy if exists "Users can view their own tasks" on public.tasks;
create policy "Users can view their own tasks"
  on public.tasks for select
  using ( (select auth.uid()) = user_id );

drop policy if exists "Users can insert their own tasks" on public.tasks;
create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check ( (select auth.uid()) = user_id );

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks"
  on public.tasks for update
  using ( (select auth.uid()) = user_id );

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks"
  on public.tasks for delete
  using ( (select auth.uid()) = user_id );


-- USER STATS
create table if not exists public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  focus_minutes int default 0,
  sessions_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table public.user_stats enable row level security;

-- Optimized Policies for user_stats
drop policy if exists "Users can view their own stats" on public.user_stats;
create policy "Users can view their own stats"
  on public.user_stats for select
  using ( (select auth.uid()) = user_id );

drop policy if exists "Users can insert/update their own stats" on public.user_stats;
create policy "Users can insert/update their own stats"
  on public.user_stats for all
  using ( (select auth.uid()) = user_id );


-- STUDY ROOMS
create table if not exists public.study_rooms (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  is_public boolean default true,
  enable_chat boolean default true,
  lock_room boolean default false,
  discoverable boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.study_rooms enable row level security;

-- Optimized Policies for study_rooms
drop policy if exists "Public rooms are viewable by everyone" on public.study_rooms;
create policy "Public rooms are viewable by everyone"
  on public.study_rooms for select
  using ( is_public = true or (select auth.uid()) = owner_id );

drop policy if exists "Users can create rooms" on public.study_rooms;
create policy "Users can create rooms"
  on public.study_rooms for insert
  with check ( (select auth.uid()) = owner_id );

drop policy if exists "Owners can update their rooms" on public.study_rooms;
create policy "Owners can update their rooms"
  on public.study_rooms for update
  using ( (select auth.uid()) = owner_id );


-- ROOM USERS (Presence)
create table if not exists public.room_users (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.study_rooms(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('studying', 'break', 'idle')) default 'studying',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(room_id, user_id)
);

alter table public.room_users enable row level security;

-- Optimized Policies for room_users
drop policy if exists "Room users are viewable by everyone in the room" on public.room_users;
create policy "Room users are viewable by everyone in the room"
  on public.room_users for select
  using ( true );

drop policy if exists "Users can join rooms" on public.room_users;
create policy "Users can join rooms"
  on public.room_users for insert
  with check ( (select auth.uid()) = user_id );

drop policy if exists "Users can update their status" on public.room_users;
create policy "Users can update their status"
  on public.room_users for update
  using ( (select auth.uid()) = user_id );

drop policy if exists "Users can leave rooms" on public.room_users;
create policy "Users can leave rooms"
  on public.room_users for delete
  using ( (select auth.uid()) = user_id );


-- ACHIEVEMENTS
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.achievements enable row level security;

-- Optimized Policies for achievements
drop policy if exists "Achievements are viewable by everyone" on public.achievements;
create policy "Achievements are viewable by everyone"
  on public.achievements for select
  using ( true );


-- USER ACHIEVEMENTS
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

-- Optimized Policies for user_achievements
drop policy if exists "User achievements are viewable by everyone" on public.user_achievements;
create policy "User achievements are viewable by everyone"
  on public.user_achievements for select
  using ( true );


-- RPC: Increment User Stats (Safe Upsert)
create or replace function increment_user_stats(row_user_id uuid, row_date date, minutes int)
returns void as $$
begin
  insert into public.user_stats (user_id, date, focus_minutes, sessions_count)
  values (row_user_id, row_date, minutes, 1)
  on conflict (user_id, date)
  do update set
    focus_minutes = user_stats.focus_minutes + minutes,
    sessions_count = user_stats.sessions_count + 1;
end;
$$ language plpgsql security definer;


-- RPC: Get Weekly Leaderboard
create or replace function get_weekly_leaderboard()
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  total_minutes bigint,
  rank bigint
) as $$
begin
  return query
  select
    s.user_id,
    p.nickname as display_name,
    p.avatar_url,
    sum(s.focus_minutes)::bigint as total_minutes,
    rank() over (order by sum(s.focus_minutes) desc) as rank
  from
    public.user_stats s
  join
    public.profiles p on s.user_id = p.id
  where
    s.date >= (current_date - interval '7 days')
  group by
    s.user_id, p.nickname, p.avatar_url
  order by
    total_minutes desc
  limit 50;
end;
$$ language plpgsql security definer;


-- RPC: Get Global Leaderboard
create or replace function get_global_leaderboard()
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  total_minutes bigint,
  rank bigint
) as $$
begin
  return query
  select
    s.user_id,
    p.nickname as display_name,
    p.avatar_url,
    sum(s.focus_minutes)::bigint as total_minutes,
    rank() over (order by sum(s.focus_minutes) desc) as rank
  from
    public.user_stats s
  join
    public.profiles p on s.user_id = p.id
  group by
    s.user_id, p.nickname, p.avatar_url
  order by
    total_minutes desc
  limit 50;
end;
$$ language plpgsql security definer;
