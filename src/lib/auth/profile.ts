import type { SupabaseClient } from "@supabase/supabase-js";
import { type PartialProfile, PartialProfileSchema } from "@/types/db/profile";

/**
 * Fetches and validates a user's profile from Supabase
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch profile for
 * @param signal - Optional AbortSignal for cancellation
 * @returns Validated PartialProfile or null if error/not found
 *
 * @example
 * ```ts
 * const profile = await fetchProfile(supabase, userId);
 * if (profile) {
 *   console.log(profile.nickname);
 * }
 * ```
 */
export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
  signal?: AbortSignal,
): Promise<PartialProfile | null> {
  try {
    let query = supabase
      .from("profiles")
      .select("id, nickname, avatar_url, onboarding_completed, status")
      .eq("id", userId);

    // Add abort signal if provided
    if (signal) {
      query = query.abortSignal(signal);
    }

    const { data: profileData, error: profileError } =
      await query.maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw new Error(profileError.message);
    }

    // Return null if no profile exists (e.g., during onboarding)
    if (!profileData) {
      return null;
    }

    // Validate with Zod schema
    const validated = PartialProfileSchema.safeParse(profileData);
    if (validated.success) {
      return validated.data;
    }

    console.error("Profile validation failed:", validated.error);
    throw new Error("Profile validation failed");
  } catch (err) {
    // Don't throw abort errors, just return null
    if (err instanceof Error && err.name === "AbortError") {
      return null;
    }
    // Handle abort errors from Supabase
    if (err instanceof Error && err.message?.includes("AbortError")) {
      return null;
    }
    throw err;
  }
}
