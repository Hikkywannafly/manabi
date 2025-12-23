import type { PomodoroSessionDB } from "../services/timer-service";

export interface DailyStats {
  focusTime: number; // in minutes
  completedSessions: number;
  totalSessions: number;
  completionRate: number; // percentage
  byMode: {
    focus: number;
    shortBreak: number;
    longBreak: number;
  };
}

/**
 * Calculate daily statistics from sessions
 */
export function calculateDailyStats(sessions: PomodoroSessionDB[]): DailyStats {
  // All sessions in the database are already completed
  const totalSessions = sessions.length;

  const focusTime = sessions
    .filter((s) => s.mode === "focus")
    .reduce((acc, s) => acc + s.duration_minutes, 0); // Already in minutes

  const byMode = {
    focus: sessions.filter((s) => s.mode === "focus").length,
    shortBreak: sessions.filter((s) => s.mode === "shortBreak").length,
    longBreak: sessions.filter((s) => s.mode === "longBreak").length,
  };

  // All sessions are completed, so completion rate is always 100%
  const completionRate = totalSessions > 0 ? 100 : 0;

  return {
    focusTime: Math.round(focusTime),
    completedSessions: totalSessions,
    totalSessions,
    completionRate,
    byMode,
  };
}

/**
 * Calculate weekly statistics
 */
export function calculateWeeklyStats(
  sessions: PomodoroSessionDB[],
): DailyStats {
  // Same calculation as daily but for a week
  return calculateDailyStats(sessions);
}

/**
 * Get productivity score (0-100)
 */
export function getProductivityScore(stats: DailyStats): number {
  // Simple scoring algorithm:
  // - 50% based on completion rate
  // - 30% based on number of completed sessions (max 8 sessions = 100%)
  // - 20% based on focus time (max 4 hours = 100%)

  const completionScore = stats.completionRate * 0.5;
  const sessionScore = Math.min((stats.completedSessions / 8) * 100, 100) * 0.3;
  const timeScore = Math.min((stats.focusTime / 240) * 100, 100) * 0.2;

  return Math.round(completionScore + sessionScore + timeScore);
}

/**
 * Format focus time for display
 */
export function formatFocusTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
