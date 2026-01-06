"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Brain,
  Clock,
  Layers,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-provider";
import { StatisticsService } from "@/features/statistics/services/statistics-service";
import { useProfile } from "../hooks";

export function ProfileStatsGrid() {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  // Fetch focus metrics for real Session Quality data
  const { data: focusMetrics } = useQuery({
    queryKey: ["focus-metrics", user?.id],
    queryFn: () => StatisticsService.getFocusMetrics(user?.id ?? ""),
    enabled: !!user,
  });

  // Calculate productivity score based on consistency and focus quality
  const productivityScore = Math.round(
    ((focusMetrics?.consistency || 0) + (focusMetrics?.focusQuality || 0)) / 2,
  );

  const stats = [
    {
      title: "Study Streak",
      value: profile?.current_streak || 0,
      description: `Longest: ${profile?.longest_streak || 0} days`,
      icon: <Trophy className="size-4 text-orange-500" />,
    },
    {
      title: "Total Focus Time",
      value: formatMinutes(focusMetrics?.totalMinutes || 0),
      description: "Time spent studying",
      icon: <Clock className="size-4 text-blue-500" />,
    },
    {
      title: "Level Progress",
      value: `Level ${profile?.level || 1}`,
      description: `${(profile?.total_xp || 0).toLocaleString()} XP`,
      icon: <Zap className="size-4 text-yellow-500" />,
      progress: calculateLevelProgress(
        profile?.total_xp || 0,
        profile?.level || 1,
      ),
    },
    {
      title: "Focus Quality",
      value: `${focusMetrics?.focusQuality || 0}%`,
      description: "Average focus quality",
      icon: <Target className="size-4 text-green-500" />,
      progress: focusMetrics?.focusQuality || 0,
    },
    {
      title: "Quizzes Created",
      value: profile?.quizzes_count || 0,
      description: "Total quizzes generated",
      icon: <Brain className="size-4 text-purple-500" />,
    },
    {
      title: "Flashcards Created",
      value: profile?.decks_count || 0,
      description: "Total card decks created",
      icon: <BookOpen className="size-4 text-indigo-500" />,
    },
    {
      title: "Content Created",
      value: (profile?.quizzes_count || 0) + (profile?.decks_count || 0),
      description: "Total learning materials",
      icon: <Layers className="size-4 text-pink-500" />,
    },
    {
      title: "Productivity Score",
      value: `${productivityScore}%`,
      description: "Based on consistency & focus",
      icon: <TrendingUp className="size-4 text-emerald-500" />,
      progress: productivityScore,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border-none bg-secondary/50 shadow-none backdrop-blur-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">{stat.title}</h3>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
            {stat.progress !== undefined && (
              <Progress value={stat.progress} className="mt-2 h-1" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h}h ${m}m`;
}

function calculateLevelProgress(xp: number, level: number) {
  // Each level requires level * 1000 XP
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  return Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
}
