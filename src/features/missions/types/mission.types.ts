export type Mission = {
  id: string;
  type: "DAILY" | "WEEKLY";
  title: string;
  description: string | null;
  xp_reward: number | null;
  target_value: number;
  criteria_type: string;
  is_active: boolean | null;
  created_at: string | null;
};

export type UserMission = {
  id: string;
  mission_id: string;
  mission: Mission;
  current_value: number;
  target_value: number;
  status: "ACTIVE" | "COMPLETED";
  period_start: string;
  progress_percentage: number;
};

export type MissionCompletionResult = {
  completed: UserMission[];
  totalXpEarned: number;
};
