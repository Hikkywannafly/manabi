"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActivityCalendar } from "../hooks/use-statistics";

function getColor(level: number) {
  if (level === 0) return "bg-secondary-foreground/10";
  if (level === 1) return "bg-blue-200 dark:bg-blue-900";
  if (level === 2) return "bg-blue-400 dark:bg-blue-700";
  if (level === 3) return "bg-blue-600 dark:bg-blue-500";
  return "bg-blue-700 dark:bg-blue-400";
}

export function ActivityCalendar() {
  const { data: activityData = [], isLoading } = useActivityCalendar();

  // Fill in missing days with zero activity (last 365 days)
  const fullYearData = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    const dateStr = date.toISOString().split("T")[0];

    const existing = activityData.find((d) => d.date === dateStr);
    return existing || { date: dateStr, count: 0, level: 0 };
  });

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 365 }).map((_, i) => (
          <div
            key={i}
            className="size-2.5 animate-pulse rounded-sm bg-secondary-foreground/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {fullYearData.map((day, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger>
                <div className={`size-2.5 rounded-sm ${getColor(day.level)}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {day.count} minutes on{" "}
                  {new Date(day.date).toLocaleDateString()}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 text-muted-foreground text-xs">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="size-2.5 rounded-sm bg-secondary-foreground/10"></div>
          <div className="size-2.5 rounded-sm bg-blue-200 dark:bg-blue-900"></div>
          <div className="size-2.5 rounded-sm bg-blue-400 dark:bg-blue-700"></div>
          <div className="size-2.5 rounded-sm bg-blue-600 dark:bg-blue-500"></div>
          <div className="size-2.5 rounded-sm bg-blue-700 dark:bg-blue-400"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
