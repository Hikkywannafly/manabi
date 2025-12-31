import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/db/profile";

export const AccountService = {
  async updateProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<Profile> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
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
