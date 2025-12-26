import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";

type SessionUser = {
  id: string;
  email: string | undefined;
  name: string;
  nickname: string;
  image: string | null;
  banner: string | null;
  isProfilePublic: boolean;
  timezone: string;
  status: string;
};

type SessionResponse = {
  user: SessionUser;
  expires: string | null;
};

/**
 * Fetch session data from API endpoint
 * This is useful for debugging and can be used as an alternative to useAuth
 */
async function fetchSession(): Promise<SessionResponse> {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch session");
  }

  return response.json();
}

/**
 * Hook to fetch session data from API
 * Use this for debugging or when you need server-validated session
 * For most cases, use useAuth() instead which is faster (client-side)
 */
export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: fetchSession,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
