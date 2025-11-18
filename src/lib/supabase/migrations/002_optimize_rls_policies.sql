-- Migration: Optimize RLS Policies for Performance
-- Date: 2025-01-18
-- Purpose: Fix Supabase linter warnings by optimizing RLS policies

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles visible to all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create optimized policies
-- 1. Merge two SELECT policies into one to avoid multiple permissive policies
-- 2. Use (select auth.uid()) instead of auth.uid() to prevent re-evaluation per row
CREATE POLICY "Profiles are viewable by owner or if public" ON public.profiles
  FOR SELECT USING (
    (select auth.uid()) = id OR is_public = TRUE
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);
