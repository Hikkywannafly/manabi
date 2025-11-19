import { useState } from "react";

export interface TimerStats {
  focusTime: number; // in minutes
  completedSessions: number;
  currentStreak: number; // in days
}

export function useTimerStats() {
  const [stats] = useState<TimerStats>({
    focusTime: 0,
    completedSessions: 0,
    currentStreak: 0,
  });

  // TODO: Fetch from database
  // TODO: Update stats when session completes

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return {
    stats,
    formatFocusTime,
  };
}
