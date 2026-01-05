import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { StatisticsService } from "../services/statistics-service";

export function useStudyStreak() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["study-streak", user?.id],
    queryFn: () => StatisticsService.getStudyStreak(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useFocusMetrics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["focus-metrics", user?.id],
    queryFn: () => StatisticsService.getFocusMetrics(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useBestStudyTime() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["best-study-time", user?.id],
    queryFn: () => StatisticsService.getBestStudyHour(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useMostProductiveDay() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["most-productive-day", user?.id],
    queryFn: () => StatisticsService.getMostProductiveDay(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useActivityCalendar() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["activity-calendar", user?.id],
    queryFn: () => StatisticsService.getActivityCalendarData(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useWeeklyStudyHours() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["weekly-study-hours", user?.id],
    queryFn: () => StatisticsService.getWeeklyStudyHours(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useQuizPerformance() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["quiz-performance", user?.id],
    queryFn: () => StatisticsService.getQuizPerformance(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useFlashcardProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["flashcard-progress", user?.id],
    queryFn: () => StatisticsService.getFlashcardProgress(user?.id ?? ""),
    enabled: !!user,
  });
}

export function useHourlyEfficiency() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["hourly-efficiency", user?.id],
    queryFn: () => StatisticsService.getHourlyEfficiency(user?.id ?? ""),
    enabled: !!user,
  });
}
