"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data: 365 days of activity
const activityData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(new Date().setDate(new Date().getDate() - i)).toISOString(),
  count: Math.floor(Math.random() * 5),
})).reverse();

function getColor(count: number) {
  if (count === 0) return "bg-secondary-foreground/10";
  if (count === 1) return "bg-blue-200 dark:bg-blue-900";
  if (count === 2) return "bg-blue-400 dark:bg-blue-700";
  if (count === 3) return "bg-blue-600 dark:bg-blue-500";
  return "bg-blue-700 dark:bg-blue-400";
}

export function ActivityCalendar() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {activityData.map((day, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger>
                <div className={`size-2.5 rounded-sm ${getColor(day.count)}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {day.count} activities on{" "}
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
