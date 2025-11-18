-- Drop existing table if exists (careful in production!)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Thông tin profile
  nickname TEXT NOT NULL,
  full_name TEXT,
  bio TEXT,

  -- Media
  avatar_url TEXT,
  banner_url TEXT,

  -- Trạng thái onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,

  -- Tuỳ chỉnh
  account_type TEXT DEFAULT 'free', -- free, pro, premium
  status TEXT DEFAULT 'active', -- active, inactive, suspended, deleted
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  theme TEXT DEFAULT 'light', -- light, dark, auto

  -- Quyền riêng tư
  is_public BOOLEAN DEFAULT TRUE,
  allow_messages BOOLEAN DEFAULT TRUE,
  show_email BOOLEAN DEFAULT FALSE,

  -- Liên hệ
  website_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,

  -- Thống kê
  total_posts INT DEFAULT 0,
  total_followers INT DEFAULT 0,
  total_following INT DEFAULT 0,

  -- Timestamp
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Metadata
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_nickname_idx ON public.profiles(nickname);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles(status);
CREATE INDEX IF NOT EXISTS profiles_account_type_idx ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(onboarding_completed_at DESC);
CREATE INDEX IF NOT EXISTS profiles_is_public_idx ON public.profiles(is_public);

-- RLS Policies
-- Policy: Users can view own profile OR public profiles (merged for performance)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles visible to all" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by owner or if public" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner or if public" ON public.profiles
  FOR SELECT USING (
    (select auth.uid()) = id OR is_public = TRUE
  );

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Trigger: Auto update updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at_trigger ON public.profiles;
CREATE TRIGGER profiles_updated_at_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();
