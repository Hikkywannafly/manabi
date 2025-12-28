"use client";

import { DashboardPage } from "@/components/layouts";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-provider";
import { LeaderboardWidget } from "@/features/dashboard/components/leaderboard-widget";
import { MissionsWidget } from "@/features/dashboard/components/missions-widget";
import { RecentNotesWidget } from "@/features/dashboard/components/recent-notes-widget";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { StudyHoursWidget } from "@/features/dashboard/components/study-hours-widget";
import { StudyPlansWidget } from "@/features/dashboard/components/study-plans-widget";
import { StudyTimeWidget } from "@/features/dashboard/components/study-time-widget";
import { WelcomeHeader } from "@/features/dashboard/components/welcome-header";
import { WrappedBanner } from "@/features/dashboard/components/wrapped-banner";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

export function DashboardContent() {
  const { user } = useAuth();
  const { stats, missions, notes, leaderboard, isLoading } =
    useDashboardStats();

  if (isLoading) {
    return (
      <DashboardPage>
        <div className="space-y-4">
          {/* Simple skeleton loading state */}
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardPage>
    );
  }

  // Safe defaults if data is missing
  const statsData = stats.data || {
    quizzesCount: 0,
    flashcardsCount: 0,
    collectionsCount: 0,
    streak: 0,
    xp: 0,
    level: 1,
  };

  return (
    <DashboardPage
      headerAction={<div />} // Header hidden by default in DashboardPage if no action, we can customize
    >
      <div className="flex flex-col">
        {/* Maximum width container matching the design */}
        <div className="container max-w-7xl md:px-0">
          <div className="space-y-6 py-6 md:py-8">
            <WelcomeHeader
              userName={
                user?.user_metadata?.full_name || user?.email?.split("@")[0]
              }
              level={statsData.level}
              xp={statsData.xp}
            />

            <StatsGrid
              quizzesCount={statsData.quizzesCount}
              flashcardsCount={statsData.flashcardsCount}
              collectionsCount={statsData.collectionsCount}
              streak={statsData.streak}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {/* Study Plans & Hours Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <StudyPlansWidget />
                  <StudyHoursWidget />
                </div>

                {/* Empty State Banner (Flashcards) - Optional, mimicking HTML */}
                <div className="rounded-lg border border-muted-foreground/30 border-dashed bg-secondary p-4 text-center shadow-sm">
                  <p className="text-muted-foreground text-sm">
                    No flashcard sets are due for review right now.
                  </p>
                </div>

                <MissionsWidget missions={missions.data || []} />
              </div>

              <div className="lg:col-span-1">
                <WrappedBanner />
                <StudyTimeWidget />
                <RecentNotesWidget notes={notes.data || []} />
                <LeaderboardWidget users={leaderboard.data || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
