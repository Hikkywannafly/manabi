"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActivityCalendar } from "../hooks/use-statistics";

function getActivityColor(count: number): string {
  if (count === 0) return "bg-secondary/50 hover:bg-secondary";
  if (count < 30)
    return "bg-blue-200 dark:bg-blue-900/40 hover:bg-blue-300 dark:hover:bg-blue-900/60";
  if (count < 60)
    return "bg-blue-400 dark:bg-blue-700/60 hover:bg-blue-500 dark:hover:bg-blue-700/80";
  if (count < 90)
    return "bg-blue-600 dark:bg-blue-500/70 hover:bg-blue-700 dark:hover:bg-blue-500/90";
  return "bg-blue-700 dark:bg-blue-400 hover:bg-blue-800 dark:hover:bg-blue-300";
}

export function ActivityCalendar() {
  const { data: activityData = [], isLoading } = useActivityCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create calendar grid
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get activity data for current month (using local timezone)
  const getActivityForDay = (day: number) => {
    const date = new Date(year, month, day);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return activityData.find((d) => d.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded bg-secondary"
            />
          ))}
        </div>
      </div>
    );
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = firstDay.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-muted-foreground text-sm">
          {monthName}
        </h4>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-7 px-2 text-xs"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="size-7"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="size-7"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="w-full">
        {/* Week day headers */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-[10px] text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const activity = getActivityForDay(day);
            const activityCount = activity?.count || 0;
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <TooltipProvider key={day}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex aspect-square w-full items-center justify-center rounded border transition-all ${
                        isToday
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      } ${getActivityColor(activityCount)}`}
                    >
                      <span
                        className={`font-medium text-xs ${
                          activityCount >= 60 ? "text-white" : "text-foreground"
                        }`}
                      >
                        {day}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {new Date(year, month, day).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {activity
                          ? `${activity.count} minutes of study`
                          : "No activity"}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex max-w-[350px] items-center justify-end gap-2 border-t pt-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="size-2.5 rounded-sm bg-secondary/50"></div>
          <div className="size-2.5 rounded-sm bg-blue-200 dark:bg-blue-900/40"></div>
          <div className="size-2.5 rounded-sm bg-blue-400 dark:bg-blue-700/60"></div>
          <div className="size-2.5 rounded-sm bg-blue-600 dark:bg-blue-500/70"></div>
          <div className="size-2.5 rounded-sm bg-blue-700 dark:bg-blue-400"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
