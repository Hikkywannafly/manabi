"use client";

import { Progress } from "@/components/ui/progress";

interface WelcomeHeaderProps {
  userName?: string | null;
  level: number;
  xp: number;
  nextLevelXp?: number; // Default to 100 for now if not calculated
}

export function WelcomeHeader({
  userName,
  level,
  xp,
  nextLevelXp = 1000, // Example generic threshold
}: WelcomeHeaderProps) {
  const displayName = userName || "Student";
  // Calculate progress percentage, capped at 100
  const progress = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-muted-foreground">
            Ready for another productive study session?
          </p>
        </div>
      </div>
      <div className="w-full rounded-lg border bg-secondary p-4 sm:w-auto sm:min-w-[200px] md:min-w-[250px]">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-foreground text-sm">
            Level {level}
          </span>
          <span className="text-muted-foreground text-xs">
            {xp} / {nextLevelXp} XP
          </span>
        </div>
        <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary-foreground/10">
          <Progress value={progress} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
