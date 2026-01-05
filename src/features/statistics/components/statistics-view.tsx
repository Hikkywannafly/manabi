"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarIcon,
  Clock,
  Flame,
  Plus,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-provider";
import { createClient } from "@/lib/supabase/client";
import {
  useBestStudyTime,
  useFocusMetrics,
  useMostProductiveDay,
  useStudyStreak,
} from "../hooks/use-statistics";
import { ActivityCalendar } from "./activity-calendar";
import { FlashcardProgressChart } from "./flashcard-progress-chart";
import { HourlyEfficiencyChart } from "./hourly-efficiency-chart";
import { MissionProgressWidget } from "./mission-progress-widget";
import { QuizPerformanceChart } from "./quiz-performance-chart";
import { SummaryCard } from "./summary-card";
import { WeeklyStudyHoursChart } from "./weekly-study-hours-chart";
import { XPGrowthChart } from "./xp-growth-chart";
import { XPSourceBreakdown } from "./xp-source-breakdown";

export function StatisticsView() {
  const { user } = useAuth();
  const { data: streakData } = useStudyStreak();
  const { data: focusMetrics } = useFocusMetrics();
  const { data: bestStudyTime } = useBestStudyTime();
  const { data: productiveDay } = useMostProductiveDay();

  // Fetch user stats (level, XP) directly from profiles
  const { data: userStats } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("level, xp")
        .eq("id", user?.id ?? "")
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Get focus quality label
  const getFocusQualityLabel = (quality: number) => {
    if (quality >= 75) return "Excellent Focus";
    if (quality >= 50) return "Good Focus";
    if (quality >= 25) return "Building Focus";
    return "Needs Improvement";
  };

  const userLevel = userStats?.level || 1;
  const userXP = userStats?.xp || 0;
  const xpForNextLevel = userLevel * 1000;

  return (
    <div className="container max-w-7xl space-y-6 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-2xl">Your Statistics</h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="mx-2 h-10 rounded-xl border-none px-4 shadow-none"
              >
                <span className="mr-2 text-muted-foreground">This Month</span>
                <span className="opacity-60">▼</span>
              </Button>
              <Button className="h-10 rounded-xl">
                <Plus className="mr-2 size-4" />
                Add Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Learning Level"
          icon={<Trophy className="size-4 text-yellow-500" />}
          value={`Level ${userLevel}`}
          subtext={`${userXP} / ${xpForNextLevel} XP`}
          progress={(userXP / xpForNextLevel) * 100}
          gradient="from-yellow-500/10 to-orange-500/10"
        />
        <SummaryCard
          title="Study Streak"
          icon={
            <Flame
              className={`size-4 ${(streakData?.currentStreak || 0) > 0 ? "text-orange-500" : "text-muted-foreground"}`}
            />
          }
          value={`${streakData?.currentStreak || 0} days`}
          subtext={`Longest: ${streakData?.longestStreak || 0} days`}
          progress={
            (streakData?.currentStreak || 0) > 0
              ? Math.min(((streakData?.currentStreak || 0) / 7) * 100, 100)
              : 0
          }
          gradient="from-orange-500/10 to-red-500/10"
          extra={
            <div className="mt-2">
              <div className="rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-2 py-0.5 text-center sm:px-3 sm:py-1">
                <p className="font-semibold text-[10px] text-green-600 sm:text-xs dark:text-green-400">
                  {(streakData?.currentStreak || 0) > 0
                    ? `${streakData?.currentStreak} day streak! 🔥`
                    : "Start your streak!"}
                </p>
              </div>
              <div className="mt-1 flex gap-0.5 sm:mt-2 sm:gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all sm:h-1.5 ${
                      i < (streakData?.currentStreak || 0)
                        ? "bg-orange-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          }
        />
        <SummaryCard
          title="Total Focus Time"
          icon={<Clock className="size-4 text-blue-500" />}
          value={formatTime(focusMetrics?.totalMinutes || 0)}
          subtext={`${Math.round(focusMetrics?.totalMinutes || 0)} total minutes`}
          gradient="from-blue-500/10 to-purple-500/10"
        />
        <SummaryCard
          title="Focus Quality"
          icon={
            <Zap
              className={`size-4 ${(focusMetrics?.focusQuality || 0) >= 50 ? "text-yellow-500" : "text-muted-foreground"}`}
            />
          }
          value={`${focusMetrics?.focusQuality || 0}%`}
          subtext={getFocusQualityLabel(focusMetrics?.focusQuality || 0)}
          progress={focusMetrics?.focusQuality || 0}
          gradient="from-purple-500/10 to-pink-500/10"
          extra={
            <div className="mt-2 text-[10px] text-muted-foreground sm:text-xs">
              Avg: {Math.round(focusMetrics?.averageSessionMinutes || 0)}{" "}
              min/session
            </div>
          }
        />
      </div>

      {/* Activity & Weekly Hours */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border bg-secondary p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-lg">
            Study Activity Calendar
          </h3>
          <ActivityCalendar />
        </div>
        <div className="space-y-4 lg:col-span-1">
          <Tabs defaultValue="week" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="mt-0">
              <div className="rounded-lg border bg-secondary p-6">
                <div className="mb-6 flex items-center gap-2">
                  <CalendarIcon className="size-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-lg leading-none tracking-tight">
                      Weekly Study Hours
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Study time by category
                    </p>
                  </div>
                </div>
                <WeeklyStudyHoursChart />
              </div>
            </TabsContent>

            <TabsContent value="month" className="mt-0">
              <div className="rounded-lg border bg-secondary p-6">
                <div className="mb-6 flex items-center gap-2">
                  <CalendarIcon className="size-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-lg leading-none tracking-tight">
                      Monthly Study Hours
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Study time by category
                    </p>
                  </div>
                </div>
                <WeeklyStudyHoursChart />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Study Efficiency */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Study Efficiency</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Best Study Hour */}
          <div className="overflow-hidden rounded-lg border bg-secondary text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="font-medium text-sm tracking-tight">
                Best Study Hour
              </h3>
              <Clock className="size-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="font-bold text-2xl">
                {bestStudyTime?.hour || "4:00 PM"}
              </div>
              <div className="mt-2 space-y-1">
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="size-full flex-1 bg-blue-500 transition-all"
                    style={{ transform: "translateX(0%)" }}
                  />
                </div>
                <p className="font-medium text-blue-500 text-xs">
                  Peak performance
                </p>
              </div>
            </div>
          </div>

          {/* Avg Session */}
          <div className="overflow-hidden rounded-lg border bg-secondary text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="font-medium text-sm tracking-tight">
                Avg Session
              </h3>
              <Target className="size-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="font-bold text-2xl">
                {Math.round(focusMetrics?.averageSessionMinutes || 0)}m
              </div>
              <div className="mt-2 space-y-1">
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-yellow-500 transition-all"
                    style={{
                      width: `${Math.min(((focusMetrics?.averageSessionMinutes || 0) / 25) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  {(focusMetrics?.averageSessionMinutes || 0) >= 25
                    ? "Great!"
                    : "Try for 25+ min"}
                </p>
              </div>
            </div>
          </div>

          {/* Consistency */}
          <div className="overflow-hidden rounded-lg border bg-secondary text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="font-medium text-sm tracking-tight">
                Consistency
              </h3>
              <CalendarIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="font-bold text-2xl">
                {focusMetrics?.consistency || 0}%
              </div>
              <div className="mt-2 space-y-1">
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-yellow-500 transition-all"
                    style={{
                      width: `${focusMetrics?.consistency || 0}%`,
                    }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  {(focusMetrics?.consistency || 0) >= 50
                    ? "Keep it up!"
                    : "Room to improve"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Most Productive Day */}
          <div className="flex items-center justify-between rounded-lg border bg-secondary p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Zap className="size-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Most Productive Day</p>
                <p className="text-muted-foreground text-sm">
                  {productiveDay?.day || "Thursday"}
                </p>
              </div>
            </div>
            <svg
              className="size-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Focus Quality */}
          <div className="rounded-lg border bg-secondary p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <Target className="size-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">Focus Quality</p>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    {focusMetrics?.focusQuality || 0}% score
                  </p>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs">
                    {getFocusQualityLabel(focusMetrics?.focusQuality || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Study Efficiency Chart */}
      <div className="rounded-lg border bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Hourly Study Efficiency</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-info size-4 text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <HourlyEfficiencyChart />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Quiz Performance */}
        <div className="rounded-lg border bg-secondary p-6">
          <div className="mb-6 flex items-center gap-2">
            <Zap className="size-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg leading-none tracking-tight">
                Quiz Performance
              </h3>
              <p className="text-muted-foreground text-sm">
                Your quiz scores over the past weeks
              </p>
            </div>
          </div>
          <QuizPerformanceChart />
        </div>

        {/* Flashcard Progress */}
        <div className="flex flex-col rounded-lg border bg-secondary p-6">
          <div className="mb-6 flex items-center justify-center gap-2">
            <BookOpen className="size-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg leading-none tracking-tight">
                Flashcard Progress
              </h3>
              <p className="text-muted-foreground text-sm">
                Your learning progress breakdown
              </p>
            </div>
          </div>
          <div className="flex-1">
            <FlashcardProgressChart />
          </div>
        </div>
      </div>

      {/* XP Growth & Source Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* XP Growth Over Time */}
        <div className="rounded-lg border bg-secondary p-6">
          <div className="mb-6 flex items-center gap-2">
            <Trophy className="size-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg leading-none tracking-tight">
                XP Growth Over Time
              </h3>
              <p className="text-muted-foreground text-sm">
                Your XP earnings from different sources
              </p>
            </div>
          </div>
          <XPGrowthChart />
        </div>

        {/* XP Source Breakdown */}
        <div className="flex flex-col rounded-lg border bg-secondary p-6">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Target className="size-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg leading-none tracking-tight">
                XP Source Breakdown
              </h3>
              <p className="text-muted-foreground text-sm">
                Where your XP comes from
              </p>
            </div>
          </div>
          <div className="flex-1">
            <XPSourceBreakdown />
          </div>
        </div>
      </div>

      {/* Missions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-secondary p-6">
          <div className="mb-6 flex items-center gap-2">
            <Target className="size-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg leading-none tracking-tight">
              Mission Progress
            </h3>
          </div>
          <MissionProgressWidget />
        </div>
      </div>
    </div>
  );
}
