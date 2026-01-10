-- Migration: Add RLS policies for study_rooms and room_users tables
-- These tables were created manually and need proper RLS configuration

-- ============================================================================
-- STUDY_ROOMS TABLE
-- ============================================================================

-- Enable RLS (safe to run multiple times)
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view public rooms" ON public.study_rooms;
DROP POLICY IF EXISTS "Users can view own rooms" ON public.study_rooms;
DROP POLICY IF EXISTS "Users can create own rooms" ON public.study_rooms;
DROP POLICY IF EXISTS "Owners can update own rooms" ON public.study_rooms;
DROP POLICY IF EXISTS "Owners can delete own rooms" ON public.study_rooms;

-- SELECT: Users can view their own rooms OR public/discoverable rooms
CREATE POLICY "Users can view own rooms"
  ON public.study_rooms
  FOR SELECT
  USING (
    owner_id = (SELECT auth.uid())
    OR (is_public = true AND discoverable = true)
  );

-- INSERT: Users can only create rooms where they are the owner
CREATE POLICY "Users can create own rooms"
  ON public.study_rooms
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = owner_id);

-- UPDATE: Only room owners can update their rooms
CREATE POLICY "Owners can update own rooms"
  ON public.study_rooms
  FOR UPDATE
  USING ((SELECT auth.uid()) = owner_id);

-- DELETE: Only room owners can delete their rooms
CREATE POLICY "Owners can delete own rooms"
  ON public.study_rooms
  FOR DELETE
  USING ((SELECT auth.uid()) = owner_id);

-- ============================================================================
-- ROOM_USERS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE public.room_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view room members" ON public.room_users;
DROP POLICY IF EXISTS "Users can join rooms" ON public.room_users;
DROP POLICY IF EXISTS "Users can update own membership" ON public.room_users;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_users;

-- SELECT: Users can view members of rooms they belong to
CREATE POLICY "Users can view room members"
  ON public.room_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_users ru
      WHERE ru.room_id = room_users.room_id
      AND ru.user_id = (SELECT auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.study_rooms sr
      WHERE sr.id = room_users.room_id
      AND (sr.is_public = true OR sr.owner_id = (SELECT auth.uid()))
    )
  );

-- INSERT: Users can join rooms (create their own membership)
CREATE POLICY "Users can join rooms"
  ON public.room_users
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE: Users can update their own status
CREATE POLICY "Users can update own membership"
  ON public.room_users
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- DELETE: Users can leave rooms (delete their own membership)
CREATE POLICY "Users can leave rooms"
  ON public.room_users
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);
