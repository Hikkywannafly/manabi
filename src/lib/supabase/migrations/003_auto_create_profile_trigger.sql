-- 003_auto_create_profile_trigger.sql

-- 1. Add created_at column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    nickname,
    full_name,
    avatar_url,
    onboarding_completed,
    created_at
  ) VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'User'
    ),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    FALSE,
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();



-- -- 1. Add created_at
-- ALTER TABLE public.profiles
-- ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- -- 2. Create function
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (
--     id, nickname, full_name, avatar_url,
--     onboarding_completed, created_at
--   ) VALUES (
--     NEW.id,
--     COALESCE(
--       NEW.raw_user_meta_data->>'name',
--       NEW.raw_user_meta_data->>'full_name',
--       split_part(NEW.email, '@', 1),
--       'User'
--     ),
--     NEW.raw_user_meta_data->>'full_name',
--     NEW.raw_user_meta_data->>'avatar_url',
--     FALSE,
--     NOW()
--   );
--   RETURN NEW;
-- EXCEPTION
--   WHEN unique_violation THEN
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- 3. Create trigger
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.handle_new_user();
