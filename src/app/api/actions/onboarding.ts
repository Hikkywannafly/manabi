"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/db/profile";

export interface OnboardingData {
  nickname: string;
  full_name?: string;
  answers: Record<string, string>;
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Use nickname or fallback to full_name
  const nickname = data.nickname?.trim() || data.full_name?.trim();
  if (!nickname) {
    return { error: "Please enter a nickname or use your Google name" };
  }

  try {
    const onboardingAnswers = { ...data.answers };
    delete onboardingAnswers.nickname;

    // Use upsert to handle cases where trigger failed or latency issues
    // We only provide fields we want to set/update
    const profileData = {
      id: user.id, // Required for upsert to know PK
      nickname: nickname,
      full_name: data.full_name || user.user_metadata?.full_name,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      metadata: {
        onboarding_answers: onboardingAnswers,
      },
      updated_at: new Date().toISOString(),
    };

    const { error: profileError, data: profile } = await supabase
      .from("profiles")
      .upsert(profileData)
      .select()
      .maybeSingle(); // Safely handle single result result

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { error: `Failed to update profile: ${profileError.message}` };
    }

    if (!profile) {
      return { error: "Failed to retrieve profile after update" };
    }

    revalidatePath("/", "layout");
    return { success: true, profile };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { error: "Failed to complete onboarding" };
  }
}

export async function skipOnboarding() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Fallback nickname if creating new profile
    const nickname =
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User";

    const profileData = {
      id: user.id,
      nickname: nickname, // Required if inserting
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: profileError, data: profile } = await supabase
      .from("profiles")
      .upsert(profileData)
      .select()
      .maybeSingle();

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { error: `Failed to update profile: ${profileError.message}` };
    }

    if (!profile) {
      return { error: "Failed to retrieve profile after update" };
    }

    revalidatePath("/", "layout");
    return { success: true, profile };
  } catch (error) {
    console.error("Error skipping onboarding:", error);
    return { error: "Failed to skip onboarding" };
  }
}

export async function updateProfile(profileUpdates: Partial<Profile>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // updated_at is automatically handled by database trigger
    const { error, data: profile } = await supabase
      .from("profiles")
      .update(profileUpdates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true, profile };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function getProfile(userId?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const targetId = userId || user.id;

  try {
    const { error, data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("id", targetId)
      .single();

    if (error) {
      return { error: error.message };
    }

    if (profile.id !== user.id && !profile.is_public) {
      return { error: "Profile not found" };
    }

    return { success: true, profile };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { error: "Failed to fetch profile" };
  }
}

export async function getFullProfile(userId?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const targetId = userId || user.id;

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", targetId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      return { error: profileError.message };
    }

    if (!profile) {
      return { error: "Profile not found" };
    }

    if (profile.id !== user.id && !profile.is_public) {
      return { error: "Profile not found" };
    }

    const { data } = await supabase.auth.admin.getUserById(targetId);
    const authUser = data.user;

    const fullProfile = {
      email: authUser?.email,
      phone: authUser?.phone,
      created_at: authUser?.created_at,
      last_sign_in_at: authUser?.last_sign_in_at,
      ...profile,
    };

    return { success: true, profile: fullProfile };
  } catch (error) {
    console.error("Error fetching full profile:", error);
    return { error: "Failed to fetch profile" };
  }
}
