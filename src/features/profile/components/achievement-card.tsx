"use client";

import { motion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AchievementWithProgress } from "@/services/achievement-service";

interface AchievementCardProps {
  achievement: AchievementWithProgress;
}

const rarityStyles = {
  Common:
    "from-slate-500/10 to-slate-500/5 text-slate-500 border-slate-500/20 shadow-slate-500/5",
  Rare: "from-blue-500/10 to-blue-500/5 text-blue-500 border-blue-500/20 shadow-blue-500/5",
  Epic: "from-purple-500/10 to-purple-500/5 text-purple-500 border-purple-500/20 shadow-purple-500/5",
  Legendary:
    "from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-500/20 shadow-amber-500/5",
};

const badgeStyles = {
  Common: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
  Rare: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  Epic: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  Legendary: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
};

const categoryIcons = {
  Study: "📚",
  Creation: "✨",
  Performance: "🎯",
  Streak: "🔥",
  Social: "👥",
  Special: "⭐",
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const currentRarityStyle =
    rarityStyles[achievement.rarity] || rarityStyles.Common;
  const currentBadgeStyle =
    badgeStyles[achievement.rarity] || badgeStyles.Common;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden border-primary/20 bg-gradient-to-br shadow-md ring-1 ring-primary/5 transition-all duration-300",
          currentRarityStyle,
        )}
      >
        {/* Highlight Glow */}
        <div className="-translate-y-12 absolute top-0 right-0 h-32 w-32 translate-x-12 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-60" />

        <CardContent className="p-6">
          <div className="flex gap-5">
            {/* Icon Wrapper */}
            <div className="relative">
              <div
                className={cn(
                  "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-4xl shadow-inner ring-1 ring-primary/20 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
                )}
              >
                <span className="drop-shadow-sm">
                  {achievement.icon || categoryIcons[achievement.category]}
                </span>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="-top-2 -right-2 absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg"
              >
                <Award className="h-3.5 w-3.5" />
              </motion.div>
            </div>

            {/* Info Container */}
            <div className="flex flex-1 flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-foreground text-lg leading-tight">
                    {achievement.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 font-bold text-[10px] uppercase tracking-wider",
                      currentBadgeStyle,
                    )}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>

                <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                  {achievement.description}
                </p>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 font-bold text-[11px] text-primary">
                  <Sparkles className="h-3 w-3" />+{achievement.xp_reward} XP
                </div>

                {achievement.unlocked_at && (
                  <span className="font-medium text-[11px] text-muted-foreground italic">
                    Earned{" "}
                    {new Date(achievement.unlocked_at).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
