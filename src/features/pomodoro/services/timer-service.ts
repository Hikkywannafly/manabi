import type { TimerMode } from "../types";

export interface PomodoroSessionDB {
  id?: string;
  user_id: string;
  mode: TimerMode;
  duration: number; // in seconds
  completed: boolean;
  task?: string;
  tag?: string;
  started_at: Date;
  completed_at?: Date;
  created_at?: Date;
}

/**
 * Save a completed session to the database
 */
export async function saveSession(
  session: Omit<PomodoroSessionDB, "id" | "created_at">,
): Promise<PomodoroSessionDB | null> {
  try {
    // TODO: Implement Supabase integration
    // const { data, error } = await supabase
    //   .from("pomodoro_sessions")
    //   .insert(session)
    //   .select()
    //   .single();
    //
    // if (error) throw error;
    // return data;

    console.log("Session saved:", session);
    return null;
  } catch (error) {
    console.error("Failed to save session:", error);
    throw error;
  }
}

/**
 * Get sessions for a specific date
 */
export async function getSessionsByDate(
  userId: string,
  date: Date,
): Promise<PomodoroSessionDB[]> {
  try {
    // TODO: Implement Supabase integration
    // const startOfDay = new Date(date);
    // startOfDay.setHours(0, 0, 0, 0);
    //
    // const endOfDay = new Date(date);
    // endOfDay.setHours(23, 59, 59, 999);
    //
    // const { data, error } = await supabase
    //   .from("pomodoro_sessions")
    //   .select("*")
    //   .eq("user_id", userId)
    //   .gte("created_at", startOfDay.toISOString())
    //   .lte("created_at", endOfDay.toISOString())
    //   .order("created_at", { ascending: false });
    //
    // if (error) throw error;
    // return data || [];

    console.log("Fetching sessions for:", userId, date);
    return [];
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    throw error;
  }
}

/**
 * Get user's current streak
 */
export async function getCurrentStreak(userId: string): Promise<number> {
  try {
    // TODO: Implement streak calculation
    // 1. Get all sessions ordered by date
    // 2. Check consecutive days with at least 1 completed session
    // 3. Return streak count

    console.log("Calculating streak for:", userId);
    return 0;
  } catch (error) {
    console.error("Failed to calculate streak:", error);
    return 0;
  }
}
