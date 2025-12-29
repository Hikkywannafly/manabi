import { createClient } from "@/lib/supabase/client";

export type AchievementRarity = "Common" | "Rare" | "Epic" | "Legendary";
export type AchievementCategory =
  | "Study"
  | "Creation"
  | "Performance"
  | "Streak"
  | "Social"
  | "Special";

export type Achievement = {
  id: string; // uuid
  code: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xp_reward: number;
  total_steps: number;
  sort_order: number;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress_snapshot?: number;
  achievement?: Achievement;
};

export type AchievementWithProgress = Achievement & {
  unlocked: boolean;
  unlocked_at?: string;
  progress: number; // Current steps completed
  progress_percentage: number;
};

export const achievementService = {
  /**
   * Fetches all achievements with the user's current progress and unlock status.
   */
  async getAchievementsWithProgress(
    userId: string,
  ): Promise<AchievementWithProgress[]> {
    const supabase = createClient();

    // 1. Fetch all achievements (metadata)
    const { data: achievements, error: achError } = await supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true });

    if (achError) throw achError;

    // 2. Fetch user's unlocked achievements
    const { data: userUnlocks, error: userError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId);

    if (userError) throw userError;

    // 3. Fetch user stats for dynamic progress calculation

    // Stats: Quiz Count
    const { count: quizCount } = await supabase
      .from("quiz_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Stats: Created Quizzes
    const { count: createdQuizzesCount } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId);

    // Stats: Created Decks
    const { count: createdDecksCount } = await supabase
      .from("decks")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId);

    // Stats: Total Flashcards Created
    const { data: userDecks } = await supabase
      .from("decks")
      .select("id")
      .eq("owner_id", userId);

    const deckIds = (userDecks || []).map((d) => d.id);
    const { count: flashcardsCount } = await supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .in("deck_id", deckIds.length > 0 ? deckIds : [""]);

    // Stats: Study Minutes & Streaks (From profiles or aggregated)
    // For now assuming these columns exist on profiles from migration
    const { data: _profile } = await supabase
      .from("profiles")
      .select("total_xp, level")
      .eq("id", userId)
      .single();

    // Create a map of unlocked IDs
    const unlockedMap = new Map(
      (userUnlocks || []).map((u) => [u.achievement_id, u]),
    );

    // Map achievements to include progress
    return (achievements as Achievement[]).map((ach) => {
      const userUnlock = unlockedMap.get(ach.id);
      let currentSteps = 0;

      // Calculate current steps based on achievement code logic
      switch (ach.code) {
        // Study / Quizzes
        case "FIRST_STEPS":
        case "QUIZ_NOVICE":
        case "QUIZ_EXPERT":
        case "QUIZ_MASTER":
        case "QUIZ_LEGEND":
          currentSteps = quizCount || 0;
          break;

        // Creation - Quizzes
        case "FIRST_QUIZ_CREATOR":
        case "QUIZ_CREATOR_1":
          currentSteps = createdQuizzesCount || 0;
          break;

        // Creation - Flashcard Decks
        case "FIRST_DECK_CREATOR":
        case "DECK_CREATOR_10":
        case "DECK_CREATOR_50":
          currentSteps = createdDecksCount || 0;
          break;

        // Creation - Flashcards
        case "FLASHCARD_CREATOR_100":
        case "FLASHCARD_CREATOR_500":
          currentSteps = flashcardsCount || 0;
          break;

        // Default Logic
        default:
          if (userUnlock) currentSteps = ach.total_steps;
          break;
      }

      // If already unlocked, ensure progress shows 100%
      if (userUnlock && currentSteps < ach.total_steps) {
        currentSteps = ach.total_steps;
      }

      const progressPercentage =
        ach.total_steps > 0
          ? Math.min(100, Math.round((currentSteps / ach.total_steps) * 100))
          : 0;

      return {
        ...ach,
        unlocked: !!userUnlock,
        unlocked_at: userUnlock?.unlocked_at,
        progress: currentSteps,
        progress_percentage: progressPercentage,
      };
    });
  },

  /**
   * Check and unlock achievements based on a recent action.
   * Can be called after a quiz finish, etc.
   */
  /**
   * Check and unlock achievements based on a recent action.
   * Returns a list of newly unlocked achievements and "near-miss" achievements.
   */
  async checkAndUnlockAchievements(
    userId: string,
  ): Promise<{ unlocked: Achievement[]; nearMiss: Achievement[] }> {
    const supabase = createClient();

    // 1. Fetch all data using the existing logic (reuse getAchievementsWithProgress for convenience)
    // Note: In high-scale app, we would optimize this to only check relevant achievements.
    const allAchievements = await this.getAchievementsWithProgress(userId);

    // 2. Filter for UNLOCKED items that are NOT yet in the database as unlocked
    // Wait, getAchievementsWithProgress already checks DB for 'unlocked' status based on 'user_achievements' table.
    // So if it returns unlocked=false, but progress >= total_steps, it means we need to unlock it NOW.

    const newlyUnlocked: Achievement[] = [];
    const nearMiss: Achievement[] = [];

    for (const ach of allAchievements) {
      if (!ach.unlocked) {
        // Check if condition is met
        if (ach.progress >= ach.total_steps) {
          // Unlock it!
          const { error } = await supabase.from("user_achievements").insert({
            user_id: userId,
            achievement_id: ach.id,
            unlocked_at: new Date().toISOString(),
            progress_snapshot: ach.progress,
          });

          if (!error) {
            newlyUnlocked.push(ach);

            // Also award XP
            await supabase.rpc("increment_user_xp", {
              x_user_id: userId,
              x_amount: ach.xp_reward,
            });
          }
        } // Check for near miss (e.g. > 80% complete)
        else if (ach.progress_percentage >= 80) {
          nearMiss.push(ach);
        }
      }
    }

    return { unlocked: newlyUnlocked, nearMiss };
  },

  // Keep original methods for compatibility if needed, but typed correctly
  async getAchievements() {
    const supabase = createClient();
    const { data } = await supabase.from("achievements").select("*");
    return data as Achievement[];
  },

  async getUserAchievements(userId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_achievements")
      .select(`*, achievement:achievements(*)`)
      .eq("user_id", userId);
    return data as UserAchievement[];
  },
};
