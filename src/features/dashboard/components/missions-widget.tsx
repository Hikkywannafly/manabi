"use client";

import { Circle, CircleCheckBig, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { DashboardMission } from "../services/dashboard-service";

interface MissionsWidgetProps {
  missions: DashboardMission[];
}

export function MissionsWidget({ missions }: MissionsWidgetProps) {
  // Separate daily and weekly missions
  const dailyMissions = missions.filter((m) => m.type === "DAILY");
  const weeklyMissions = missions.filter((m) => m.type === "WEEKLY");

  const renderMission = (mission: DashboardMission) => {
    const isCompleted = mission.status === "COMPLETED";
    const currentValue = mission.current_value || 0;

    return (
      <div
        key={mission.id}
        className={cn(
          "rounded-md border bg-tertiary p-3",
          isCompleted && "bg-green-50 dark:bg-green-900/20",
        )}
      >
        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-1 items-center gap-3 overflow-hidden">
            {isCompleted ? (
              <CircleCheckBig className="size-5 shrink-0 text-green-600" />
            ) : (
              <Circle className="size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-foreground text-sm">
                {mission.title}
              </p>
              <p className="truncate text-muted-foreground text-xs">
                {mission.description}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "ml-2 flex items-center gap-1 whitespace-nowrap font-medium text-sm",
              isCompleted && "text-green-600",
            )}
          >
            <Sparkles className="size-4" /> +{mission.xp_reward || 0} XP
          </span>
        </div>
        {!isCompleted && (
          <div className="flex items-center gap-2">
            <Progress value={mission.progress || 0} className="h-2 flex-1" />
            <span className="min-w-12 text-right text-muted-foreground text-xs">
              {currentValue}/{mission.target_value}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-lg border bg-secondary p-4 shadow-sm">
      <Tabs defaultValue="daily" className="w-full">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-lg">Missions</h2>
          <TabsList className="h-10">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="mt-0 space-y-3">
          {dailyMissions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No active daily missions
            </div>
          ) : (
            dailyMissions.map(renderMission)
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-0 space-y-3">
          {weeklyMissions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No active weekly missions
            </div>
          ) : (
            weeklyMissions.map(renderMission)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
