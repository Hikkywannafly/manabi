import { z } from "zod";

// ============================================================================
// Constants & Enums
// ============================================================================

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

// Enum value arrays for Zod schemas
const ACCOUNT_TYPE_VALUES = Object.values(ACCOUNT_TYPES) as [
  string,
  ...string[],
];
const PROFILE_STATUS_VALUES = Object.values(PROFILE_STATUSES) as [
  string,
  ...string[],
];
const THEME_VALUES = Object.values(THEMES) as [string, ...string[]];

const optionalUrl = () => z.string().url().optional().or(z.literal(""));

type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

const jsonValueSchema: z.ZodType<JSONValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);
const datetimeString = () => z.string().datetime().or(z.string());

// ============================================================================
// Zod Schemas
// ============================================================================

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string().min(1),
  full_name: z.string().optional(),
  bio: z.string().optional(),

  // Media URLs
  avatar_url: optionalUrl(),
  banner_url: optionalUrl(),

  // Onboarding
  onboarding_completed: z.boolean(),
  onboarding_completed_at: datetimeString().optional(),

  // Account settings
  account_type: z.enum(ACCOUNT_TYPE_VALUES),
  status: z.enum(PROFILE_STATUS_VALUES),
  language: z.string(),
  timezone: z.string(),
  theme: z.enum(THEME_VALUES),

  // Privacy settings
  is_public: z.boolean(),
  allow_messages: z.boolean(),
  show_email: z.boolean(),

  // Social URLs
  website_url: optionalUrl(),
  twitter_url: optionalUrl(),
  github_url: optionalUrl(),
  linkedin_url: optionalUrl(),

  // Stats
  total_posts: z.number().int().min(0),
  total_followers: z.number().int().min(0),
  total_following: z.number().int().min(0),

  // Timestamps
  created_at: datetimeString(),
  updated_at: datetimeString(),

  // Metadata
  metadata: z.record(z.string(), jsonValueSchema).optional(),
});

// Partial schema for fetching limited fields (used in AuthProvider)
// Includes all essential fields for UI display (similar to StudyOn.app session)
export const PartialProfileSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string().min(1),
  full_name: z.string().optional().nullable(),
  avatar_url: optionalUrl().nullable(),
  banner_url: optionalUrl().nullable(),
  onboarding_completed: z.boolean(),
  status: z.enum(PROFILE_STATUS_VALUES),
  timezone: z.string().optional().nullable(),
  is_public: z.boolean().optional().nullable(),
});

export const FullProfileSchema = ProfileSchema.extend({
  email: z.string().email(),
  phone: z.string().optional(),
  created_at: datetimeString(),
  last_sign_in_at: datetimeString().optional(),
});

export type AccountType = (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];
export type ProfileStatus =
  (typeof PROFILE_STATUSES)[keyof typeof PROFILE_STATUSES];
export type Theme = (typeof THEMES)[keyof typeof THEMES];

// Inferred types from Zod schemas
export type Profile = z.infer<typeof ProfileSchema>;
export type PartialProfile = z.infer<typeof PartialProfileSchema>;
export type FullProfile = z.infer<typeof FullProfileSchema>;
