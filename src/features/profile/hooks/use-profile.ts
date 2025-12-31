import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { ProfileService } from "../services/profile-service";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error("User not authenticated");
      return ProfileService.getProfile(user.id);
    },
    enabled: !!user?.id,
  });
}
