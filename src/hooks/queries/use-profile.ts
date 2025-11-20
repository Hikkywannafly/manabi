import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/auth/profile";
import { queryKeys } from "@/lib/react-query/query-keys";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

export function useProfile(userId: string | undefined) {
  const supabase = getSupabaseClient();

  return useQuery({
    queryKey: userId ? queryKeys.profiles.detail(userId) : [],
    queryFn: async ({ signal }) => {
      if (!userId) throw new Error("User ID is required");
      return fetchProfile(supabase, userId, signal);
    },
    enabled: !!userId,
  });
}
