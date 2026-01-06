import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import type { Profile } from "@/types/db/profile";
import { AccountService } from "../services/account-service";

export function useUpdateAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error("User not authenticated");
      return AccountService.updateProfile(user.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles", user?.id] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update profile");
    },
  });
}

export function useUploadAvatar() {
  const { user } = useAuth();
  const { mutateAsync: updateProfile } = useUpdateAccount();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error("User not authenticated");
      const url = await AccountService.uploadAvatar(user.id, file);
      await updateProfile({ avatar_url: url });
      return url;
    },
    onSuccess: () => {
      toast.success("Avatar uploaded successfully");
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      toast.error("Failed to upload avatar");
    },
  });
}

export function useUploadBanner() {
  const { user } = useAuth();
  const { mutateAsync: updateProfile } = useUpdateAccount();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error("User not authenticated");
      const url = await AccountService.uploadBanner(user.id, file);
      await updateProfile({ banner_url: url });
      return url;
    },
    onSuccess: () => {
      toast.success("Banner uploaded successfully");
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      toast.error("Failed to upload banner");
    },
  });
}
