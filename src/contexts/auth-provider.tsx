"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfile } from "@/hooks/queries/use-profile";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";
import type { PartialProfile } from "@/types/db/profile";

export type AuthState = {
  user: User | null;
  session: Session | null;
  profile: PartialProfile | null;
  isLoading: boolean;
  error: Error | null;
};

export type AuthContextType = AuthState & {
  isOnboardingCompleted: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = useMemo(() => getSupabaseClient(), []);

  // Initialize session
  useEffect(() => {
    const abortController = new AbortController();

    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (abortController.signal.aborted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Error initializing auth:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingSession(false);
        }
      }
    };

    initializeAuth();
    return () => {
      abortController.abort();
    };
  }, [supabase]);

  // Listen to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Use React Query for profile (with caching!)
  const {
    data: profile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
    error: profileError,
  } = useProfile(user?.id);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setSession(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Error signing out:", err);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    }
  }, [supabase]);

  // Refresh profile manually
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    await refetchProfile();
  }, [user?.id, refetchProfile]);

  // Combine loading states
  const isLoading = isLoadingSession || (!!user && isLoadingProfile);

  // Combine errors
  const combinedError = error || (profileError as Error | null);

  const value = useMemo(
    () => ({
      user,
      session,
      profile: profile ?? null,
      isLoading,
      error: combinedError,
      isOnboardingCompleted: profile?.onboarding_completed === true,
      signOut: handleSignOut,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      combinedError,
      handleSignOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useRequireAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return { user: null, isLoading: true };
  }

  if (!user) {
    throw new Error("Authentication required");
  }

  return { user, isLoading: false };
}

export function useUser() {
  const { user, profile } = useAuth();
  return { user, profile };
}
