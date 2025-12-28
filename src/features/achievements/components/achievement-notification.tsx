"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/services/achievement-service";

interface AchievementNotificationProps {
  achievement: Achievement;
  t: string | number;
}

const rarityStyles = {
  Common: {
    gradient: "from-slate-400 to-slate-600",
    shadow: "shadow-slate-500/20",
    iconColor: "text-slate-500",
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  Rare: {
    gradient: "from-blue-400 to-cyan-500",
    shadow: "shadow-blue-500/30",
    iconColor: "text-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  Epic: {
    gradient: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/40",
    iconColor: "text-purple-500",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  Legendary: {
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-500/50",
    iconColor: "text-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
};

import { createPortal } from "react-dom";

export function AchievementNotification({
  achievement,
  t,
}: AchievementNotificationProps) {
  const styles = rarityStyles[achievement.rarity || "Common"];

  // Use Portal to ensure it breaks out of any toast container constraints
  // and truly centers on the viewport.
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-10">
      {/* ... rest of component ... */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="pointer-events-auto relative w-full max-w-md"
      >
        {/* Glow Effect */}
        <div
          className={cn(
            "-inset-1 absolute rounded-2xl bg-gradient-to-r opacity-30 blur-xl transition-all duration-500",
            styles.gradient,
          )}
        />

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card/95 p-4 shadow-2xl backdrop-blur-md dark:bg-zinc-900/95">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground opacity-70 transition-opacity hover:bg-muted hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Animated Icon Container */}
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                delay: 0.1,
              }}
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-inner ring-2 ring-background",
                styles.gradient,
              )}
            >
              <div className="text-white">
                {achievement.icon ? (
                  <span className="text-xl">{achievement.icon}</span>
                ) : (
                  <Trophy className="size-6 text-white" />
                )}
              </div>
            </motion.div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider",
                    styles.badge,
                  )}
                >
                  <Sparkles className={cn("size-3", styles.iconColor)} />
                  {achievement.rarity}
                </span>
                <span className="font-medium text-muted-foreground text-xs">
                  +{achievement.xp_reward} XP
                </span>
              </div>

              <h3 className="truncate font-bold text-base text-foreground leading-tight">
                {achievement.title}
              </h3>

              {/* Optional: Limit description line clamp for compactness */}
              <p className="line-clamp-1 text-muted-foreground/90 text-xs">
                {achievement.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
