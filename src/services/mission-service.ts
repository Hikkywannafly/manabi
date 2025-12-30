import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

export type Mission = Database["public"]["Tables"]["missions"]["Row"];

export type MissionType = "DAILY" | "WEEKLY";

export type MissionCriteriaType =
  | "CREATE_FLASHCARD"
  | "CREATE_QUIZ"
  | "COMPLETE_QUIZ"
  | "STUDY_FLASHCARD";

export type UserMission = {
  id: string;
  mission_id: string;
  mission: Mission;
  current_value: number;
  target_value: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CLAIMED";
  period_start: string;
  progress_percentage: number;
};

export type MissionCompletionResult = {
  completed: UserMission[];
  totalXpEarned: number;
};

export const MissionService = {
  /**
   * Get user's missions with real-time progress calculation
   */
  async getUserMissions(userId: string): Promise<UserMission[]> {
    const supabase = createClient();

    // 1. Fetch all active missions
    const { data: missions, error: missionsError } = await supabase
      .from("missions")
      .select("*")
      .eq("is_active", true)
      .order("type", { ascending: true });

    if (missionsError) throw missionsError;
    if (!missions) return [];

    // 2. Get today's start and week's start
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const weekStartStr = weekStart.toISOString();

    // 3. Fetch or create user_missions records for current period
    const { data: userMissions, error: userMissionsError } = await supabase
      .from("user_missions")
      .select("*")
      .eq("user_id", userId);

    if (userMissionsError) throw userMissionsError;

    // 4. Calculate progress for each mission
    const missionsWithProgress = await Promise.all(
      missions.map(async (mission) => {
        const periodStart = mission.type === "DAILY" ? todayStr : weekStartStr;

        // Find existing user_mission record for this period
        let userMission = userMissions?.find(
          (um) =>
            um.mission_id === mission.id && um.period_start === periodStart,
        );

        // If no record exists for this period, create one
        if (!userMission) {
          const { data: newUserMission, error: createError } = await supabase
            .from("user_missions")
            .insert({
              user_id: userId,
              mission_id: mission.id,
              period_start: periodStart,
              progress_value: 0,
              status: "IN_PROGRESS",
            })
            .select()
            .single();

          if (createError) {
            // Handle race condition: Duplicate key violation (23505)
            if (createError.code === "23505") {
              const { data: existingMission } = await supabase
                .from("user_missions")
                .select("*")
                .eq("user_id", userId)
                .eq("mission_id", mission.id)
                .eq("period_start", periodStart)
                .single();

              userMission = existingMission || undefined;
            } else {
              console.error("Failed to create user mission:", createError);
              // Fallback to not crashing, just skipping this mission for now or
              // letting it be undefined and handled gracefully later
            }
          } else {
            userMission = newUserMission || undefined;
          }
        }

        // Calculate current progress based on criteria_type
        let currentValue = 0;

        switch (mission.criteria_type) {
          case "CREATE_FLASHCARD": {
            // Count flashcard DECKS created in this period
            const { count } = await supabase
              .from("decks")
              .select("*", { count: "exact", head: true })
              .eq("owner_id", userId)
              .gte("created_at", periodStart);
            currentValue = count || 0;
            break;
          }

          case "CREATE_QUIZ": {
            // Count quizzes created in this period
            const { count } = await supabase
              .from("quizzes")
              .select("*", { count: "exact", head: true })
              .eq("owner_id", userId)
              .gte("created_at", periodStart);
            currentValue = count || 0;
            break;
          }

          case "COMPLETE_QUIZ": {
            // Count quiz attempts in this period
            const { count } = await supabase
              .from("quiz_attempts")
              .select("*", { count: "exact", head: true })
              .eq("user_id", userId)
              .gte("created_at", periodStart);
            currentValue = count || 0;
            break;
          }

          case "STUDY_FLASHCARD": {
            // Count unique decks studied in this period via flashcard_reviews
            const { count } = await supabase
              .from("flashcard_reviews")
              .select("deck_id", { count: "exact", head: true })
              .eq("user_id", userId)
              .gte("reviewed_at", periodStart);
            currentValue = count || 0;
            break;
          }
        }

        // Update progress_value if it changed
        if (userMission && currentValue !== userMission.progress_value) {
          await supabase
            .from("user_missions")
            .update({ progress_value: currentValue })
            .eq("id", userMission.id);
        }

        const progressPercentage = Math.min(
          100,
          Math.round((currentValue / mission.target_value) * 100),
        );

        return {
          id: userMission?.id || "",
          mission_id: mission.id,
          mission,
          current_value: currentValue,
          target_value: mission.target_value,
          status: userMission?.status || "IN_PROGRESS",
          period_start: periodStart,
          progress_percentage: progressPercentage,
        } as UserMission;
      }),
    );

    return missionsWithProgress;
  },

  /**
   * Check and complete missions that meet their target
   * Returns newly completed missions
   */
  async checkAndCompleteMissions(
    userId: string,
  ): Promise<MissionCompletionResult> {
    const supabase = createClient();

    // Get all missions with current progress
    const missions = await this.getUserMissions(userId);

    const completed: UserMission[] = [];
    let totalXpEarned = 0;

    // Check each mission
    for (const mission of missions) {
      // Skip if already completed
      if (mission.status === "COMPLETED") continue;

      // Check if target is reached
      if (mission.current_value >= mission.target_value) {
        try {
          // Call RPC function to complete mission and award XP
          const { error } = await supabase.rpc("complete_user_mission", {
            p_user_id: userId,
            p_mission_id: mission.mission_id,
            p_xp_reward: mission.mission.xp_reward || 0,
          });

          if (!error) {
            completed.push({
              ...mission,
              status: "COMPLETED",
            });
            totalXpEarned += mission.mission.xp_reward || 0;
          }
        } catch (error) {
          console.error("Failed to complete mission:", error);
        }
      }
    }

    return { completed, totalXpEarned };
  },

  /**
   * Get missions grouped by type (Daily/Weekly)
   */
  async getMissionsByType(
    userId: string,
    type: MissionType,
  ): Promise<UserMission[]> {
    const allMissions = await this.getUserMissions(userId);
    return allMissions.filter((m) => m.mission.type === type);
  },
};
