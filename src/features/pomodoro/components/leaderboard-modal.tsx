"use client";

import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Globe,
  Info,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";

// Mock Data
const LEADERBOARD_DATA = [
  {
    rank: 1,
    user: "Khánh",
    country: "🇻🇳",
    avatar: "https://github.com/shadcn.png",
    time: "170h 36m",
    points: 140,
    trend: "up",
  },
  {
    rank: 2,
    user: "Mai Dang Huy",
    country: "🇻🇳",
    avatar: "https://github.com/shadcn.png",
    time: "166h 31m",
    points: 317,
    trend: "up",
  },
  {
    rank: 3,
    user: "kvoizz",
    country: "🇰🇷",
    avatar: "https://github.com/shadcn.png",
    time: "148h 20m",
    points: 156,
    trend: "same",
  },
  {
    rank: 4,
    user: "Opstry",
    country: "",
    avatar: null,
    time: "142h 32m",
    points: 73,
    trend: "up",
  },
  {
    rank: 5,
    user: "MidnightStarz",
    country: "🇺🇸",
    avatar: "https://github.com/shadcn.png",
    time: "121h 40m",
    points: 133,
    trend: "up",
  },
];

export function LeaderboardModal() {
  const { isLeaderboardOpen, toggleLeaderboard } = usePomodoroStore();

  if (!isLeaderboardOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-[800px] max-w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-white/60 hover:text-white"
          onClick={toggleLeaderboard}
        >
          <X className="size-6" />
        </Button>

        <div className="flex flex-col p-6 lg:p-8">
          {/* Header Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-auto gap-2 border-white border-b-2 px-3 py-2 font-bold text-lg text-white hover:bg-transparent hover:text-white"
              >
                <Globe className="size-5" />
                Global
              </Button>
              <Button
                variant="ghost"
                className="h-auto gap-2 px-3 py-2 font-bold text-lg text-white/60 hover:bg-transparent hover:text-white"
              >
                <UsersIcon className="size-5" />
                Friends
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Info className="mr-2 size-5 cursor-pointer text-white/60 hover:text-white" />
              <div className="flex items-center rounded-xl bg-white/5 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-lg px-3 text-white/60 hover:text-white"
                >
                  Daily
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-lg px-3 text-white/60 hover:text-white"
                >
                  Weekly
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-lg bg-white/10 px-3 font-bold text-white hover:bg-white/20 hover:text-white"
                >
                  Monthly
                </Button>
              </div>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="mb-4 flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <span className="font-medium text-white">Nov 2025</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto pr-2">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-black/90 text-white/40 text-xs uppercase">
                <tr>
                  <th className="w-8 py-3"></th>
                  <th className="w-12 py-3">#</th>
                  <th className="px-4 py-3">User</th>
                  <th className="py-3 text-right">Time</th>
                  <th className="py-3 pl-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {LEADERBOARD_DATA.map((item) => (
                  <tr key={item.rank} className="group hover:bg-white/5">
                    <td className="py-3 pl-2">
                      {item.trend === "up" && (
                        <TrendingUp className="size-4 text-green-500" />
                      )}
                      {item.trend === "down" && (
                        <TrendingDown className="size-4 text-red-500" />
                      )}
                    </td>
                    <td className="py-3 font-bold text-white">{item.rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-white text-xs">
                          {item.avatar ? (
                            <Image
                              src={item.avatar}
                              alt={item.user}
                              className="size-full rounded-full object-cover"
                            />
                          ) : (
                            item.user[0]
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 font-bold text-white">
                            {item.country && (
                              <span className="text-base">{item.country}</span>
                            )}
                            <span className="truncate">{item.user}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-white">
                      {item.time}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-white/60">
                        <Gift className="size-4" />
                        <span className="font-bold text-white">
                          {item.points}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
    >
      <path
        d="M402,168c-2.93,40.67-33.1,72-66,72s-63.12-31.32-66-72c-3-42.31,26.37-72,66-72S405,126.46,402,168Z"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "32px",
        }}
      ></path>
      <path
        d="M336,304c-65.17,0-127.84,32.37-143.54,95.41-2.08,8.34,3.15,16.59,11.72,16.59H467.83c8.57,0,13.77-8.25,11.72-16.59C463.85,335.36,401.18,304,336,304Z"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeMiterlimit: 10,
          strokeWidth: "32px",
        }}
      ></path>
      <path
        d="M200,185.94C197.66,218.42,173.28,244,147,244S96.3,218.43,94,185.94C91.61,152.15,115.34,128,147,128S202.39,152.77,200,185.94Z"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "32px",
        }}
      ></path>
      <path
        d="M206,306c-18.05-8.27-37.93-11.45-59-11.45-52,0-102.1,25.85-114.65,76.2C30.7,377.41,34.88,384,41.72,384H154"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "32px",
        }}
      ></path>
    </svg>
  );
}
