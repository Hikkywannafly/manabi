import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/db/profile";

export const AccountService = {
  async updateProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<Profile> {
    const supabase = createClient();

    // Remove virtual or read-only fields that aren't columns in the profiles table
    const validUpdates = { ...updates } as any;
    delete validUpdates.quizzes_count;
    delete validUpdates.decks_count;
    delete validUpdates.created_at;
    delete validUpdates.updated_at;
    delete validUpdates.xp; // 'xp' might be an alias for 'total_xp' or similar

    const { data, error } = await supabase
      .from("profiles")
      .update(validUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    return data as Profile;
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles").getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadBanner(userId: string, file: File): Promise<string> {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-banner-${Math.random()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles").getPublicUrl(filePath);

    return publicUrl;
  },
};
