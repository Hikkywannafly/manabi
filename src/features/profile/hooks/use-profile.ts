import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { queryKeys } from "@/lib/react-query/query-keys";
import { ProfileService } from "../services/profile-service";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: user?.id
      ? queryKeys.profiles.detail(user.id)
      : ["profiles", "me"],
    queryFn: () => {
      if (!user?.id) throw new Error("User not authenticated");
      return ProfileService.getProfile(user.id);
    },
    enabled: !!user?.id,
  });
}
