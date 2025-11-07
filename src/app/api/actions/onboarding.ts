"use server";

import { revalidatePath } from "next/cache";
import type { Profile } from "@/db/profile";
import { createClient } from "@/lib/supabase/server";

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

  // Validate nickname
  const nickname = data.nickname?.trim();
  if (!nickname) {
    return { error: "Please enter a nickname" };
  }

  try {
    // 1. Update user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        nickname: nickname,
        full_name: data.full_name,
      },
    });

    if (authError) {
      console.error("Auth update error:", authError);
      return { error: authError.message };
    }

    // 2. Upsert profile
    const profileData: Partial<Profile> = {
      id: user.id,
      nickname: nickname,
      full_name: data.full_name,
      avatar_url: user.user_metadata?.avatar_url || undefined,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      status: "active",
      account_type: "free",
      language: "en",
      timezone: "UTC",
      theme: "light",
      is_public: true,
      allow_messages: true,
      show_email: false,
      total_posts: 0,
      total_followers: 0,
      total_following: 0,
      updated_at: new Date().toISOString(),
      metadata: {
        onboarding_answers: data.answers,
      },
    };

    const { error: profileError, data: profile } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "id" })
      .select()
      .single();

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { error: profileError.message };
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
    const nickname =
      user.user_metadata?.name || user.email?.split("@")[0] || "User";

    const profileData: Partial<Profile> = {
      id: user.id,
      nickname: nickname,
      avatar_url: user.user_metadata?.avatar_url || undefined,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      status: "active",
      account_type: "free",
      language: "en",
      timezone: "UTC",
      theme: "light",
      is_public: true,
      allow_messages: true,
      show_email: false,
      total_posts: 0,
      total_followers: 0,
      total_following: 0,
      updated_at: new Date().toISOString(),
    };

    const { error: profileError, data: profile } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "id" })
      .select()
      .single();

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { error: profileError.message };
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
    const { error, data: profile } = await supabase
      .from("profiles")
      .update({
        ...profileUpdates,
        updated_at: new Date().toISOString(),
      })
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
