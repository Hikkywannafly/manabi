"use client";

import { ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";

export function StudyPlansWidget() {
  const progress = 20; // Mocked for now

  return (
    <div className="overflow-hidden rounded-lg border bg-secondary/50 text-card-foreground shadow-sm transition-all hover:bg-secondary/80">
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <h3 className="flex items-center justify-between font-semibold text-base tracking-tight">
          <Link
            className="flex items-center gap-2 hover:underline"
            href="/dashboard/planner"
          >
            <Calendar className="size-4" />
            Study Plans
          </Link>
          <Link href="/dashboard/planner">
            <ArrowUpRight className="size-4 text-muted-foreground hover:text-foreground" />
          </Link>
        </h3>
      </div>
      <div className="space-y-4 p-6 pt-0">
        <div className="flex items-start gap-4">
          <div className="relative size-14 shrink-0">
            {/* Circular Progress SVG */}
            <svg className="-rotate-90 size-full" viewBox="0 0 36 36">
              <path
                className="text-muted/20"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-primary transition-all duration-500 ease-in-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${progress}, 100`}
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px]">
              {progress}%
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold">Study More This Week</h4>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <div className="inline-flex items-center rounded-full border border-transparent bg-secondary px-1 py-0 font-semibold text-[10px] text-secondary-foreground uppercase transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                WEEKLY
              </div>
              <span>Ends Dec 28</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
