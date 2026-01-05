import { createClient } from "@/lib/supabase/client";

export type StudyStreak = {
  currentStreak: number;
  longestStreak: number;
};

export type FocusMetrics = {
  totalMinutes: number;
  totalHours: number;
  averageSessionMinutes: number;
  focusQuality: number;
  consistency: number;
};

export type BestStudyTime = {
  hour: string;
  score: number;
};

export type ProductiveDay = {
  day: string;
  totalMinutes: number;
};

export type ActivityData = {
  date: string;
  count: number;
  level: number; // 0-4 for heatmap intensity
};

export type WeeklyStudyData = {
  day: string;
  quiz: number;
  flashcard: number;
  pomodoro: number;
};

export type QuizPerformanceData = {
  week: string;
  score: number;
  count: number;
};

export type FlashcardProgressData = {
  status: string;
  count: number;
  percentage: number;
};

export const StatisticsService = {
  // Study Streak - Tracks ALL study activities
  async getStudyStreak(userId: string): Promise<StudyStreak> {
    const supabase = createClient();

    const { data, error } = (await supabase.rpc(
      "calculate_study_streak" as any,
      { p_user_id: userId },
    )) as any;

    if (error) throw error;

    return {
      currentStreak: data?.[0]?.current_streak || 0,
      longestStreak: data?.[0]?.longest_streak || 0,
    };
  },

  // Focus Metrics - Combined from Pomodoro + Quiz + Flashcard
  async getFocusMetrics(userId: string): Promise<FocusMetrics> {
    const supabase = createClient();

    // Get all pomodoro sessions
    const { data: sessions } = await supabase
      .from("pomodoro_sessions")
      .select("duration_minutes, start_time")
      .eq("user_id", userId)
      .eq("mode", "focus");

    // Get all quiz attempts
    const { data: quizAttempts } = await supabase
      .from("quiz_attempts")
      .select("duration_seconds, completed_at")
      .eq("user_id", userId);

    // Get all flashcard reviews (estimate 2 min per review)
    const { data: flashcardReviews } = await supabase
      .from("flashcard_reviews")
      .select("last_reviewed")
      .eq("user_id", userId);

    // Calculate total focus time from all sources
    const pomodoroMinutes =
      sessions?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
    const quizMinutes =
      quizAttempts?.reduce(
        (sum, q) => sum + (q.duration_seconds || 0) / 60,
        0,
      ) || 0;
    const flashcardMinutes = (flashcardReviews?.length || 0) * 2; // 2 min per review

    const totalMinutes = pomodoroMinutes + quizMinutes + flashcardMinutes;
    const sessionCount =
      (sessions?.length || 0) +
      (quizAttempts?.length || 0) +
      (flashcardReviews?.length || 0);
    const averageSessionMinutes =
      sessionCount > 0 ? totalMinutes / sessionCount : 0;

    // Calculate focus quality (percentage of quality sessions across all activities)
    const qualityPomodoroSessions =
      sessions?.filter((s) => s.duration_minutes >= 25).length || 0;
    const qualityQuizSessions =
      quizAttempts?.filter((q) => (q.duration_seconds || 0) >= 300).length || 0; // 5+ min
    const qualityFlashcardSessions = flashcardReviews?.length || 0; // All flashcard reviews count as quality

    const totalQualitySessions =
      qualityPomodoroSessions + qualityQuizSessions + qualityFlashcardSessions;
    const focusQuality =
      sessionCount > 0 ? (totalQualitySessions / sessionCount) * 100 : 0;

    // Calculate consistency (percentage of days with ANY activity in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pomodoroActiveDays = new Set(
      sessions
        ?.filter((s) => s.start_time && new Date(s.start_time) >= thirtyDaysAgo)
        .map(
          (s) => new Date(s.start_time as string).toISOString().split("T")[0],
        ),
    );

    const quizActiveDays = new Set(
      quizAttempts
        ?.filter(
          (q) => q.completed_at && new Date(q.completed_at) >= thirtyDaysAgo,
        )
        .map(
          (q) => new Date(q.completed_at as string).toISOString().split("T")[0],
        ),
    );

    const flashcardActiveDays = new Set(
      flashcardReviews
        ?.filter(
          (f) => f.last_reviewed && new Date(f.last_reviewed) >= thirtyDaysAgo,
        )
        .map(
          (f) =>
            new Date(f.last_reviewed as string).toISOString().split("T")[0],
        ),
    );

    // Combine all unique active days
    const allActiveDays = new Set([
      ...pomodoroActiveDays,
      ...quizActiveDays,
      ...flashcardActiveDays,
    ]);

    const consistency = (allActiveDays.size / 30) * 100;

    return {
      totalMinutes,
      totalHours: totalMinutes / 60,
      averageSessionMinutes,
      focusQuality: Math.round(focusQuality),
      consistency: Math.round(consistency),
    };
  },

  // Best Study Hour
  async getBestStudyHour(userId: string): Promise<BestStudyTime> {
    const supabase = createClient();

    const { data: sessions } = await supabase
      .from("pomodoro_sessions")
      .select("start_time, duration_minutes")
      .eq("user_id", userId)
      .eq("mode", "focus");

    // Group by hour
    const hourlyData: Record<number, number> = {};

    sessions?.forEach((session) => {
      const hour = new Date(session.start_time).getHours();
      hourlyData[hour] = (hourlyData[hour] || 0) + session.duration_minutes;
    });

    // Find best hour
    let bestHour = 16; // Default to 4 PM
    let maxMinutes = 0;

    Object.entries(hourlyData).forEach(([hour, minutes]) => {
      if (minutes > maxMinutes) {
        maxMinutes = minutes;
        bestHour = Number.parseInt(hour, 10);
      }
    });

    const formatHour = (h: number) => {
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h % 12 || 12;
      return `${displayHour}:00 ${period}`;
    };

    return {
      hour: formatHour(bestHour),
      score: maxMinutes,
    };
  },

  // Most Productive Day
  async getMostProductiveDay(userId: string): Promise<ProductiveDay> {
    const supabase = createClient();

    const { data: sessions } = await supabase
      .from("pomodoro_sessions")
      .select("start_time, duration_minutes")
      .eq("user_id", userId)
      .eq("mode", "focus");

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dailyData: Record<number, number> = {};

    sessions?.forEach((session) => {
      const day = new Date(session.start_time).getDay();
      dailyData[day] = (dailyData[day] || 0) + session.duration_minutes;
    });

    let bestDay = 4; // Default to Thursday
    let maxMinutes = 0;

    Object.entries(dailyData).forEach(([day, minutes]) => {
      if (minutes > maxMinutes) {
        maxMinutes = minutes;
        bestDay = Number.parseInt(day, 10);
      }
    });

    return {
      day: dayNames[bestDay],
      totalMinutes: maxMinutes,
    };
  },

  // Activity Calendar Data (last 90 days)
  async getActivityCalendarData(userId: string): Promise<ActivityData[]> {
    const supabase = createClient();

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Get all activity types
    const { data: pomodoroSessions } = await supabase
      .from("pomodoro_sessions")
      .select("start_time, duration_minutes")
      .eq("user_id", userId)
      .gte("start_time", ninetyDaysAgo.toISOString());

    const { data: quizAttempts } = await supabase
      .from("quiz_attempts")
      .select("completed_at")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .gte("completed_at", ninetyDaysAgo.toISOString());

    const { data: flashcardReviews } = await supabase
      .from("flashcard_reviews")
      .select("last_reviewed")
      .eq("user_id", userId)
      .not("last_reviewed", "is", null)
      .gte("last_reviewed", ninetyDaysAgo.toISOString());

    // Group by date
    const dailyActivity: Record<string, number> = {};

    pomodoroSessions?.forEach((session) => {
      if (session.start_time) {
        const date = new Date(session.start_time).toISOString().split("T")[0];
        dailyActivity[date] =
          (dailyActivity[date] || 0) + session.duration_minutes;
      }
    });

    quizAttempts?.forEach((attempt) => {
      if (attempt.completed_at) {
        const date = new Date(attempt.completed_at).toISOString().split("T")[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 5; // Count quiz as 5 min activity
      }
    });

    flashcardReviews?.forEach((review) => {
      if (review.last_reviewed) {
        const date = new Date(review.last_reviewed).toISOString().split("T")[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 2; // Count flashcard as 2 min activity
      }
    });

    // Convert to array with levels
    return Object.entries(dailyActivity).map(([date, minutes]) => {
      let level = 0;
      if (minutes > 0) level = 1;
      if (minutes >= 25) level = 2;
      if (minutes >= 50) level = 3;
      if (minutes >= 100) level = 4;

      return { date, count: minutes, level };
    });
  },

  // Weekly Study Hours by Category
  async getWeeklyStudyHours(userId: string): Promise<WeeklyStudyData[]> {
    const supabase = createClient();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get pomodoro sessions
    const { data: pomodoroSessions } = await supabase
      .from("pomodoro_sessions")
      .select("start_time, duration_minutes")
      .eq("user_id", userId)
      .eq("mode", "focus")
      .gte("start_time", sevenDaysAgo.toISOString());

    // Get quiz attempts
    const { data: quizAttempts } = await supabase
      .from("quiz_attempts")
      .select("completed_at, duration_seconds")
      .eq("user_id", userId)
      .gte("completed_at", sevenDaysAgo.toISOString());

    // Get flashcard reviews
    const { data: flashcardReviews } = await supabase
      .from("flashcard_reviews")
      .select("last_reviewed")
      .eq("user_id", userId)
      .gte("last_reviewed", sevenDaysAgo.toISOString());

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData: Record<
      string,
      { quiz: number; flashcard: number; pomodoro: number }
    > = {};

    // Initialize all days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = dayNames[date.getDay()];
      weeklyData[dayName] = { quiz: 0, flashcard: 0, pomodoro: 0 };
    }

    // Aggregate pomodoro
    pomodoroSessions?.forEach((session) => {
      const dayName = dayNames[new Date(session.start_time).getDay()];
      weeklyData[dayName].pomodoro += session.duration_minutes;
    });

    // Aggregate quiz (convert seconds to minutes)
    quizAttempts?.forEach((attempt) => {
      if (attempt.completed_at) {
        const dayName = dayNames[new Date(attempt.completed_at).getDay()];
        weeklyData[dayName].quiz += (attempt.duration_seconds || 0) / 60;
      }
    });

    // Aggregate flashcard (estimate 2 minutes per review)
    flashcardReviews?.forEach((review) => {
      if (review.last_reviewed) {
        const dayName = dayNames[new Date(review.last_reviewed).getDay()];
        weeklyData[dayName].flashcard += 2;
      }
    });

    return Object.entries(weeklyData).map(([day, data]) => ({
      day,
      ...data,
    }));
  },

  // Quiz Performance (last 4 weeks)
  async getQuizPerformance(userId: string): Promise<QuizPerformanceData[]> {
    const supabase = createClient();

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("completed_at, score")
      .eq("user_id", userId)
      .gte("completed_at", fourWeeksAgo.toISOString())
      .order("completed_at", { ascending: true });

    // Group by week
    const weeklyData: Record<string, { totalScore: number; count: number }> =
      {};

    attempts?.forEach((attempt) => {
      if (attempt.completed_at) {
        const date = new Date(attempt.completed_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split("T")[0];

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { totalScore: 0, count: 0 };
        }

        weeklyData[weekKey].totalScore += attempt.score;
        weeklyData[weekKey].count += 1;
      }
    });

    return Object.entries(weeklyData).map(([week, data]) => ({
      week,
      score: Math.round(data.totalScore / data.count),
      count: data.count,
    }));
  },

  // Flashcard Progress
  async getFlashcardProgress(userId: string): Promise<FlashcardProgressData[]> {
    const supabase = createClient();

    const { data: reviews } = await supabase
      .from("flashcard_reviews")
      .select("status")
      .eq("user_id", userId);

    const total = reviews?.length || 0;
    const statusCounts: Record<string, number> = {
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
    };

    reviews?.forEach((review) => {
      const status = review.status || "new";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  },

  // Hourly Study Efficiency (for chart)
  async getHourlyEfficiency(
    userId: string,
  ): Promise<Array<{ hour: string; efficiency: number }>> {
    const supabase = createClient();

    const { data: sessions } = await supabase
      .from("pomodoro_sessions")
      .select("start_time, duration_minutes")
      .eq("user_id", userId)
      .eq("mode", "focus");

    const hourlyData: Record<number, { total: number; count: number }> = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { total: 0, count: 0 };
    }

    sessions?.forEach((session) => {
      const hour = new Date(session.start_time).getHours();
      hourlyData[hour].total += session.duration_minutes;
      hourlyData[hour].count += 1;
    });

    // Calculate efficiency (0-100 scale)
    const maxAverage = Math.max(
      ...Object.values(hourlyData).map((d) =>
        d.count > 0 ? d.total / d.count : 0,
      ),
    );

    return Array.from({ length: 24 }, (_, i) => {
      const data = hourlyData[i];
      const average = data.count > 0 ? data.total / data.count : 0;
      const efficiency = maxAverage > 0 ? (average / maxAverage) * 100 : 0;

      return {
        hour: `${i.toString().padStart(2, "0")}:00`,
        efficiency: Math.round(efficiency),
      };
    });
  },
};
