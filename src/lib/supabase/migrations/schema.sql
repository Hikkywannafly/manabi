-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- NOTE: 'profiles' table already exists from previous migrations.
-- We will reference 'public.profiles' instead of creating 'public.users'.

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

-- Enable RLS for pomodoro_sessions
alter table public.pomodoro_sessions enable row level security;

-- Policies for pomodoro_sessions
drop policy if exists "Users can view their own sessions." on public.pomodoro_sessions;
create policy "Users can view their own sessions."
  on public.pomodoro_sessions for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own sessions." on public.pomodoro_sessions;
create policy "Users can insert their own sessions."
  on public.pomodoro_sessions for insert
  with check ( auth.uid() = user_id );

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

-- Enable RLS for user_stats
alter table public.user_stats enable row level security;

-- Policies for user_stats
drop policy if exists "Users can view their own stats." on public.user_stats;
create policy "Users can view their own stats."
  on public.user_stats for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can update their own stats." on public.user_stats;
create policy "Users can update their own stats."
  on public.user_stats for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own stats." on public.user_stats;
create policy "Users can insert their own stats."
  on public.user_stats for insert
  with check ( auth.uid() = user_id );

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

-- Enable RLS for study_rooms
alter table public.study_rooms enable row level security;

-- Policies for study_rooms
drop policy if exists "Public rooms are viewable by everyone." on public.study_rooms;
create policy "Public rooms are viewable by everyone."
  on public.study_rooms for select
  using ( is_public = true or auth.uid() = owner_id );

drop policy if exists "Users can create rooms." on public.study_rooms;
create policy "Users can create rooms."
  on public.study_rooms for insert
  with check ( auth.uid() = owner_id );

drop policy if exists "Owners can update their rooms." on public.study_rooms;
create policy "Owners can update their rooms."
  on public.study_rooms for update
  using ( auth.uid() = owner_id );

-- ROOM USERS (Presence)
create table if not exists public.room_users (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.study_rooms(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('studying', 'break', 'idle')) default 'studying',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(room_id, user_id)
);

-- Enable RLS for room_users
alter table public.room_users enable row level security;

-- Policies for room_users
drop policy if exists "Room users are viewable by everyone in the room." on public.room_users;
create policy "Room users are viewable by everyone in the room."
  on public.room_users for select
  using ( true );

drop policy if exists "Users can join rooms." on public.room_users;
create policy "Users can join rooms."
  on public.room_users for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their status." on public.room_users;
create policy "Users can update their status."
  on public.room_users for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can leave rooms." on public.room_users;
create policy "Users can leave rooms."
  on public.room_users for delete
  using ( auth.uid() = user_id );

-- ACHIEVEMENTS
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for achievements
alter table public.achievements enable row level security;

-- Policies for achievements
drop policy if exists "Achievements are viewable by everyone." on public.achievements;
create policy "Achievements are viewable by everyone."
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

-- Enable RLS for user_achievements
alter table public.user_achievements enable row level security;

-- Policies for user_achievements
drop policy if exists "User achievements are viewable by everyone." on public.user_achievements;
create policy "User achievements are viewable by everyone."
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
