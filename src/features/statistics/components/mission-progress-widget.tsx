"use client";

import { ChevronDown, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function MissionProgressWidget() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="text-center">
          <div className="font-bold text-2xl text-primary">0</div>
          <p className="text-muted-foreground text-sm">Completed Today</p>
          <p className="mt-1 text-blue-500 text-xs">Complete a mission!</p>
        </div>
        <div className="text-center">
          <div className="font-bold text-2xl text-primary">0</div>
          <p className="text-muted-foreground text-sm">XP from Missions</p>
          <p className="mt-1 text-green-500 text-xs">+1,768 XP available</p>
        </div>
        <div className="text-center">
          <div className="font-bold text-2xl text-muted-foreground">0%</div>
          <p className="text-muted-foreground text-sm">Completion Rate</p>
          <p className="mt-1 font-medium text-xs">Start your journey!</p>
        </div>
      </div>

      {/* Active Missions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Active Missions</h4>
          <div className="inline-flex items-center rounded-full border bg-secondary px-2.5 py-0.5 font-semibold text-secondary-foreground text-xs">
            8 active
          </div>
        </div>

        <div className="space-y-4">
          {/* Mission Item 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 font-semibold text-primary-foreground text-xs">
                  WEEKLY
                </span>
                <span className="font-medium text-sm">Weekly Study Master</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Trophy className="size-3" />
                354 XP
              </div>
            </div>
            <Progress value={0} className="h-2" />
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Study 8 different flashcard sets this week</span>
              <span>0/8</span>
            </div>
          </div>

          {/* Mission Item 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 font-semibold text-primary-foreground text-xs">
                  DAILY
                </span>
                <span className="font-medium text-sm">Daily Quiz Master</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Trophy className="size-3" />
                88 XP
              </div>
            </div>
            <Progress value={0} className="h-2" />
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Create 1 quiz</span>
              <span>0/1</span>
            </div>
          </div>
        </div>

        <Button variant="ghost" className="mt-2 h-9 w-full rounded-2xl">
          <span className="flex items-center justify-center text-xs">
            Show 5 more <ChevronDown className="ml-1 size-3" />
          </span>
        </Button>
      </div>
    </div>
  );
}
