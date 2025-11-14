"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Profile } from "@/db/profile";
import { createClient } from "@/lib/supabase/client";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // Only fetch profile fields we need (skip full select)
        if (initialSession?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, nickname, avatar_url, onboarding_completed, status")
            .eq("id", initialSession.user.id)
            .single();

          setProfile((profileData as Profile) || null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [supabase]);

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      // Fetch profile if user exists
      if (currentSession?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, nickname, avatar_url, onboarding_completed, status")
          .eq("id", currentSession.user.id)
          .single();

        setProfile((profileData as Profile) || null);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }, [supabase]);

  const isOnboardingCompleted = profile?.onboarding_completed === true;

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isOnboardingCompleted,
      signOut: handleSignOut,
    }),
    [user, session, profile, isLoading, isOnboardingCompleted, handleSignOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/**
 * Hook to require authentication
 * Throws error if user is not authenticated
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading || user) {
    return { user, isLoading };
  }

  throw new Error("Authentication required");
}

/**
 * Hook to access user data
 * Returns the current user or null
 */
export function useUser() {
  const { user, profile } = useAuth();
  return { user, profile };
}
