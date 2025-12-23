-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Enums
create type quiz_status as enum ('draft', 'generating', 'ready', 'failed');
create type quiz_visibility as enum ('public', 'private', 'shared');
create type question_type as enum ('multiple_choice', 'true_false', 'fill_in_blank', 'short_answer');

create type deck_status as enum ('draft', 'generating', 'ready', 'failed');
create type deck_visibility as enum ('public', 'private', 'shared');
create type flashcard_status as enum ('new', 'learning', 'review', 'relearning');

create type pomodoro_mode as enum ('focus', 'short_break', 'long_break');
create type study_plan_status as enum ('active', 'completed', 'archived');
create type task_priority as enum ('low', 'medium', 'high');

create type achievement_category as enum ('STUDY', 'CREATION', 'PERFORMANCE', 'STREAK', 'SOCIAL', 'SPECIAL');
create type achievement_rarity as enum ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');
create type achievement_target_type as enum ('DAYS_STREAK', 'QUIZZES_DONE', 'GOALS_COMPLETED', 'FLASHCARDS_REVIEWED', 'XP_EARNED', 'FOCUS_MINUTES');
create type user_achievement_status as enum ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

create type mission_type as enum ('DAILY', 'WEEKLY');
create type mission_status as enum ('IN_PROGRESS', 'COMPLETED', 'CLAIMED');

create type xp_source_type as enum ('ACHIEVEMENT', 'QUIZ', 'STREAK', 'MISSION', 'POMODORO');

-- Profiles Table (Enhancements)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table public.profiles
  add column if not exists banner_url text,
  add column if not exists nickname text,
  add column if not exists onboarding_completed boolean default false,
  add column if not exists xp integer default 0,
  add column if not exists level integer default 1,
  add column if not exists current_streak integer default 0,
  add column if not exists longest_streak integer default 0,
  add column if not exists last_study_date date,
  add column if not exists settings jsonb default '{}'::jsonb;

-- Collections (Content Organization)
create table if not exists public.collections (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  parent_id uuid references public.collections(id) on delete cascade,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quizzes
create table if not exists public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  collection_id uuid references public.collections(id) on delete set null,
  title text not null,
  description text,
  slug text,
  visibility quiz_visibility default 'private',
  source_type text, -- 'text', 'file', 'topic'
  source_content text, -- or file url
  generation_params jsonb default '{}'::jsonb,
  status quiz_status default 'draft',
  failure_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quiz Questions
create table if not exists public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  question_type question_type default 'multiple_choice',
  options jsonb, -- Array of strings for choices
  correct_answer text, -- For tracking correctness
  explanation text,
  order_index integer not null,
  unique(quiz_id, order_index)
);

-- Quiz Attempts
create table if not exists public.quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score integer not null,
  completed_at timestamptz default now(),
  duration_seconds integer,
  answers_log jsonb -- Map: question_id -> user_answer
);
create index if not exists idx_quiz_attempts_user_quiz on public.quiz_attempts(user_id, quiz_id);

-- Flashcard Decks
create table if not exists public.decks (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  collection_id uuid references public.collections(id) on delete set null,
  title text not null,
  description text,
  visibility deck_visibility default 'private',
  source_type text,
  source_content text,
  generation_params jsonb default '{}'::jsonb,
  status deck_status default 'draft',
  failure_reason text,
  settings jsonb default '{}'::jsonb, -- SRS settings
  mastery_percentage integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Flashcards
create table if not exists public.flashcards (
  id uuid default uuid_generate_v4() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  front text not null,
  back text not null,
  image_url text,
  order_index integer,
  created_at timestamptz default now()
);

-- Flashcard Reviews (SRS Progress)
create table if not exists public.flashcard_reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  flashcard_id uuid references public.flashcards(id) on delete cascade not null,
  last_reviewed timestamptz,
  next_review timestamptz,
  interval float,
  ease_factor float default 2.5,
  repetition_count integer default 0,
  status flashcard_status default 'new',
  unique(user_id, flashcard_id)
);

-- Pomodoro Sessions
create table if not exists public.pomodoro_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mode pomodoro_mode not null,
  duration_seconds integer not null,
  start_time timestamptz,
  end_time timestamptz,
  completed_at timestamptz default now(),
  linked_task_id uuid, -- link to planner_tasks
  rating smallint check (rating >= 1 and rating <= 5)
);

-- Notes
create table if not exists public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text,
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Study Plans
create table if not exists public.study_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  start_date date,
  end_date date,
  status study_plan_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Planner Tasks (Daily Goals)
create table if not exists public.planner_tasks (
  id uuid default uuid_generate_v4() primary key,
  plan_id uuid references public.study_plans(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  is_completed boolean default false,
  completed_at timestamptz,
  due_date timestamptz,
  priority task_priority default 'medium',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tags
create table if not exists public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null
);

-- Gamification: Achievements (Definitions)
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  title text not null,
  description text,
  category achievement_category not null,
  tier integer default 1,
  rarity achievement_rarity default 'COMMON',
  xp_reward integer default 0,
  target_type achievement_target_type not null,
  target_value integer not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- User Achievements (Progress)
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  status user_achievement_status default 'NOT_STARTED',
  progress_value integer default 0,
  unlocked_at timestamptz,
  unique(user_id, achievement_id)
);

-- Missions (Daily/Weekly Definitions)
create table if not exists public.missions (
  id uuid default uuid_generate_v4() primary key,
  type mission_type not null,
  title text not null,
  description text,
  xp_reward integer default 0,
  target_value integer not null,
  criteria_type text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- User Missions (Tracking)
create table if not exists public.user_missions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mission_id uuid references public.missions(id) on delete cascade not null,
  progress_value integer default 0,
  status mission_status default 'IN_PROGRESS',
  period_start date not null,
  unique(user_id, mission_id, period_start)
);

-- XP Transactions (History)
create table if not exists public.xp_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  source_type xp_source_type not null,
  source_id uuid,
  created_at timestamptz default now()
);

-- User Daily Stats (Activity Log)
create table if not exists public.user_daily_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  focus_minutes integer default 0,
  xp_earned integer default 0,
  quizzes_completed integer default 0,
  flashcards_reviewed integer default 0,
  tasks_completed integer default 0,
  unique(user_id, date)
);
create index if not exists idx_user_daily_stats_date on public.user_daily_stats(user_id, date);

-- Basic RLS
alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.decks enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.pomodoro_sessions enable row level security;
alter table public.notes enable row level security;
alter table public.study_plans enable row level security;
alter table public.planner_tasks enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.missions enable row level security;
alter table public.user_missions enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.user_daily_stats enable row level security;

-- Create policy for public read access to definitions
create policy "Public achievements are viewable by everyone" on public.achievements for select using (true);
create policy "Public missions are viewable by everyone" on public.missions for select using (true);

-- Create policy for user private data
create policy "Users can view their own data" on public.user_achievements for select using (auth.uid() = user_id);
create policy "Users can update their own data" on public.user_achievements for all using (auth.uid() = user_id);

create policy "Users can view their own stats" on public.user_daily_stats for select using (auth.uid() = user_id);
create policy "Users can update their own stats" on public.user_daily_stats for all using (auth.uid() = user_id);

-- (More detailed policies can be added later)
