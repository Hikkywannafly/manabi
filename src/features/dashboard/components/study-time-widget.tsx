"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { createClient } from "@/lib/supabase/client";

// Fetch today's and yesterday's study time
async function getStudyTime(userId: string) {
  const supabase = createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Fetch pomodoro sessions for today and yesterday
  const { data: sessions } = await supabase
    .from("pomodoro_sessions")
    .select("start_time, duration_minutes")
    .eq("user_id", userId)
    .eq("mode", "focus")
    .gte("start_time", yesterday.toISOString())
    .lt("start_time", tomorrow.toISOString());

  // Fetch quiz attempts for today and yesterday
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("completed_at, duration_seconds")
    .eq("user_id", userId)
    .gte("completed_at", yesterday.toISOString())
    .lt("completed_at", tomorrow.toISOString());

  let todayMinutes = 0;
  let yesterdayMinutes = 0;

  // Calculate pomodoro time
  sessions?.forEach((session) => {
    const sessionDate = new Date(session.start_time);
    if (sessionDate >= today) {
      todayMinutes += session.duration_minutes;
    } else {
      yesterdayMinutes += session.duration_minutes;
    }
  });

  // Calculate quiz time (seconds to minutes)
  quizAttempts?.forEach((attempt) => {
    if (attempt.completed_at) {
      const attemptDate = new Date(attempt.completed_at);
      const minutes = (attempt.duration_seconds || 0) / 60;
      if (attemptDate >= today) {
        todayMinutes += minutes;
      } else {
        yesterdayMinutes += minutes;
      }
    }
  });

  return {
    todayMinutes: Math.round(todayMinutes),
    yesterdayMinutes: Math.round(yesterdayMinutes),
  };
}

function formatStudyTime(minutes: number): string {
  if (minutes === 0) return "0m";
  if (minutes < 1) return `${Math.round(minutes * 60)}s`;
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function StudyTimeWidget() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["study-time-today", user?.id],
    queryFn: () => getStudyTime(user?.id ?? ""),
    enabled: !!user,
  });

  const todayTime = formatStudyTime(data?.todayMinutes || 0);
  const yesterdayTime = formatStudyTime(data?.yesterdayMinutes || 0);

  // Motivational message
  const getMessage = () => {
    const today = data?.todayMinutes || 0;
    const yesterday = data?.yesterdayMinutes || 0;

    if (today === 0 && yesterday === 0) {
      return "Start your first study session! 🚀";
    }
    if (today > yesterday) {
      return "Great job! You're ahead of yesterday! 🔥";
    }
    if (today === yesterday && today > 0) {
      return "Keep up the pace! 💪";
    }
    if (yesterday > 0) {
      return `Aim to beat yesterday's ${yesterdayTime} today!`;
    }
    return "Every minute counts! 📚";
  };

  return (
    <div className="mb-4 rounded-lg border bg-secondary p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-medium text-muted-foreground text-sm">
            Study Time
          </p>
          <div className="mt-1">
            <p className="font-semibold text-foreground text-xl tracking-tight">
              Today: {todayTime}
            </p>
            <p className="font-semibold text-muted-foreground text-xl tracking-tight">
              Yesterday: {yesterdayTime}
            </p>
          </div>
        </div>
        <div className="rounded-md bg-primary/10 p-2">
          <Clock className="size-5 text-primary" />
        </div>
      </div>
      <p className="mt-1 text-orange-600 text-xs">{getMessage()}</p>
    </div>
  );
}
