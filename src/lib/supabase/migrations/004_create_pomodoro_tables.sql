-- Migration: Create Pomodoro Tables

-- 1. pomodoro_settings
-- Stores user preferences for the timer.
create table if not exists public.pomodoro_settings (
  user_id uuid references auth.users(id) on delete cascade primary key,
  focus_duration integer not null default 25,
  short_break_duration integer not null default 5,
  long_break_duration integer not null default 15,
  long_break_interval integer not null default 4,
  auto_start_breaks boolean not null default false,
  auto_start_pomodoros boolean not null default false,
  notification_sound text not null default 'bell',
  volume integer not null default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. pomodoro_projects
-- Groups tasks together.
create table if not exists public.pomodoro_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#3b82f6',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. pomodoro_tasks
-- Specific tasks to track time against.
create table if not exists public.pomodoro_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.pomodoro_projects(id) on delete set null,
  title text not null,
  notes text,
  estimated_pomodoros integer default 1,
  completed_pomodoros integer default 0,
  is_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. pomodoro_sessions
-- Log of completed focus sessions.
create table if not exists public.pomodoro_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  task_id uuid references public.pomodoro_tasks(id) on delete set null,
  project_id uuid references public.pomodoro_projects(id) on delete set null, -- Denormalized for easier analytics
  mode text not null check (mode in ('focus', 'shortBreak', 'longBreak')),
  duration integer not null, -- in seconds
  completed_at timestamptz default now(),
  created_at timestamptz default now()
);

-- RLS Policies (Row Level Security)
alter table public.pomodoro_settings enable row level security;
alter table public.pomodoro_projects enable row level security;
alter table public.pomodoro_tasks enable row level security;
alter table public.pomodoro_sessions enable row level security;

-- Policies for pomodoro_settings
create policy "Users can view their own settings"
  on public.pomodoro_settings for select
  using (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.pomodoro_settings for update
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.pomodoro_settings for insert
  with check (auth.uid() = user_id);

-- Policies for pomodoro_projects
create policy "Users can view their own projects"
  on public.pomodoro_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.pomodoro_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.pomodoro_projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.pomodoro_projects for delete
  using (auth.uid() = user_id);

-- Policies for pomodoro_tasks
create policy "Users can view their own tasks"
  on public.pomodoro_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.pomodoro_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.pomodoro_tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.pomodoro_tasks for delete
  using (auth.uid() = user_id);

-- Policies for pomodoro_sessions
create policy "Users can view their own sessions"
  on public.pomodoro_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.pomodoro_sessions for insert
  with check (auth.uid() = user_id);
