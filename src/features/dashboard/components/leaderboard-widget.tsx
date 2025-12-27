"use client";

import { Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { LeaderboardUser } from "../services/dashboard-service";

interface LeaderboardWidgetProps {
  users: LeaderboardUser[];
}

export function LeaderboardWidget({ users }: LeaderboardWidgetProps) {
  const getRankIconColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-700";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="rounded-lg border bg-secondary p-4 shadow-sm">
      <Tabs defaultValue="weekly" className="w-full">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-yellow-500" />
            <h2 className="font-semibold text-foreground text-lg">
              Leaderboard
            </h2>
          </div>
          <TabsList className="h-10 shrink-0">
            {/* Only implementing Weekly for now as per data service */}
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="allTime">All</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weekly" className="mt-0 space-y-2">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center rounded-lg border bg-background p-3"
            >
              <div className="w-8 flex-none text-center font-medium">
                {index < 3 ? (
                  <Trophy
                    className={cn("mx-auto size-4", getRankIconColor(index))}
                  />
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex min-w-0 flex-1 items-center">
                <Link
                  href={`/dashboard/user/${user.id}`}
                  className="mr-3 transition-opacity hover:opacity-80"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.avatar_url || ""}
                      alt={user.full_name || "User"}
                    />
                    <AvatarFallback>
                      {(user.full_name || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="truncate">
                  <p className="flex flex-wrap items-center gap-1 font-medium text-sm">
                    <Link
                      href={`/dashboard/user/${user.id}`}
                      className="truncate hover:underline"
                    >
                      {user.full_name || "Unknown User"}
                    </Link>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Level {user.level || 1}
                  </p>
                </div>
              </div>
              <div className="flex-none text-right">
                <p className="flex items-center gap-1 font-medium text-sm">
                  <Sparkles className="size-4" /> {user.xp?.toLocaleString()} XP
                </p>
              </div>
            </div>
          ))}

          {/* Empty states for other tabs */}
          <TabsContent value="daily" hidden className="mt-0" />
          <TabsContent value="monthly" hidden className="mt-0" />
          <TabsContent value="allTime" hidden className="mt-0" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
