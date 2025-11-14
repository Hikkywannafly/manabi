export const ACCOUNT_TYPES = {
  FREE: "free",
  PRO: "pro",
  PREMIUM: "premium",
} as const;

export const PROFILE_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  DELETED: "deleted",
} as const;

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
} as const;

export type AccountType = (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];
export type ProfileStatus =
  (typeof PROFILE_STATUSES)[keyof typeof PROFILE_STATUSES];
export type Theme = (typeof THEMES)[keyof typeof THEMES];

export interface Profile {
  id: string;

  //  profile
  nickname: string;
  full_name?: string;
  bio?: string;

  // Media
  avatar_url?: string;
  banner_url?: string;

  // onboarding
  onboarding_completed: boolean;
  onboarding_completed_at?: string;

  account_type: AccountType;
  status: ProfileStatus;
  language: string;
  timezone: string;
  theme: Theme;

  is_public: boolean;
  allow_messages: boolean;
  show_email: boolean;

  website_url?: string;
  twitter_url?: string;
  github_url?: string;
  linkedin_url?: string;

  total_posts: number;
  total_followers: number;
  total_following: number;

  // Timestamp
  updated_at: string;

  // Metadata
  metadata?: Record<
    string,
    string | number | boolean | Record<string, unknown>
  >;
}

export interface FullProfile extends Profile {
  //auth.users
  email: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
}
