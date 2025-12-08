-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Pomodoro Sessions Table
create table if not exists pomodoro_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  mode text not null check (mode in ('focus', 'shortBreak', 'longBreak')),
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes int not null,
  created_at timestamptz default now()
);

-- Tasks Table
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  status text default 'todo' check (status in ('todo', 'in_progress', 'done')),
  estimated_pomodoros int default 1,
  actual_pomodoros int default 0,
  created_at timestamptz default now()
);

-- User Stats Table (Daily Aggregation)
create table if not exists user_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default (now() at time zone 'utc')::date,
  focus_minutes int default 0,
  sessions_count int default 0,
  unique(user_id, date)
);

-- RLS Policies
alter table pomodoro_sessions enable row level security;
alter table tasks enable row level security;
alter table user_stats enable row level security;

-- Policies for pomodoro_sessions
create policy "Users can view their own sessions"
  on pomodoro_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on pomodoro_sessions for insert
  with check (auth.uid() = user_id);

-- Policies for tasks
create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Policies for user_stats
create policy "Users can view their own stats"
  on user_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own stats"
  on user_stats for all
  using (auth.uid() = user_id);

-- Optional: RPC for incrementing stats safely
create or replace function increment_user_stats(row_user_id uuid, row_date date, minutes int)
returns void as $$
begin
  insert into user_stats (user_id, date, focus_minutes, sessions_count)
  values (row_user_id, row_date, minutes, 1)
  on conflict (user_id, date)
  do update set
    focus_minutes = user_stats.focus_minutes + minutes,
    sessions_count = user_stats.sessions_count + 1;
end;
$$ language plpgsql security definer;
