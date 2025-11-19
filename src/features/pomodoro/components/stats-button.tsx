"use client";

import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface StatsButtonProps {
  className?: string;
}

export function StatsButton({ className }: StatsButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-10 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40 sm:size-12",
            className,
          )}
          title="Statistics"
        >
          <BarChart3 className="size-5 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] border-white/10 bg-black/70 text-white backdrop-blur-xl"
        align="end"
      >
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Today's Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Focus Time</span>
              <span className="font-bold">0h 0m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Completed Sessions</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Current Streak</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">🔥</span>
                <span className="font-bold">0 days</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
