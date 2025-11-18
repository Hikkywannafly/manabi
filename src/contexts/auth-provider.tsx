"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { fetchProfile } from "@/lib/auth/profile";
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

type AuthAction =
  | {
      type: "SET_SESSION";
      payload: { session: Session | null; user: User | null };
    }
  | { type: "SET_PROFILE"; payload: PartialProfile | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: Error | null }
  | { type: "RESET" };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...state,
        session: action.payload.session,
        user: action.payload.user,
      };
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "RESET":
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const supabase = useMemo(() => getSupabaseClient(), []);

  useEffect(() => {
    const abortController = new AbortController();

    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (abortController.signal.aborted) return;

        dispatch({
          type: "SET_SESSION",
          payload: {
            session: initialSession,
            user: initialSession?.user ?? null,
          },
        });

        if (initialSession?.user) {
          try {
            const profileData = await fetchProfile(
              supabase,
              initialSession.user.id,
              abortController.signal,
            );
            if (!abortController.signal.aborted && profileData !== null) {
              dispatch({ type: "SET_PROFILE", payload: profileData });
            }
          } catch (err) {
            if (!abortController.signal.aborted) {
              console.error("Error fetching initial profile:", err);
              dispatch({
                type: "SET_ERROR",
                payload: err instanceof Error ? err : new Error(String(err)),
              });
            }
          }
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error initializing auth:", error);
          dispatch({
            type: "SET_ERROR",
            payload: error instanceof Error ? error : new Error(String(error)),
          });
        }
      } finally {
        if (!abortController.signal.aborted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    initializeAuth();
    return () => {
      abortController.abort();
    };
  }, [supabase]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      dispatch({
        type: "SET_SESSION",
        payload: {
          session: currentSession,
          user: currentSession?.user ?? null,
        },
      });
      // Only fetch profile on SIGNED_IN (profile auto-created by trigger)
      // TOKEN_REFRESHED doesn't need profile refetch
      if (currentSession?.user && event === "SIGNED_IN") {
        try {
          const profileData = await fetchProfile(
            supabase,
            currentSession.user.id,
          );
          if (profileData !== null) {
            dispatch({ type: "SET_PROFILE", payload: profileData });
          }
        } catch (err) {
          if (err instanceof Error && !err.message?.includes("AbortError")) {
            console.error("Error fetching profile on auth change:", err);
            dispatch({
              type: "SET_ERROR",
              payload: err,
            });
          }
        }
      } else if (!currentSession?.user) {
        dispatch({ type: "SET_PROFILE", payload: null });
      }

      dispatch({ type: "SET_LOADING", payload: false });
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch({ type: "RESET" });
    } catch (error) {
      console.error("Error signing out:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!state.user?.id) return;

    try {
      const profileData = await fetchProfile(supabase, state.user.id);
      if (profileData !== null) {
        dispatch({ type: "SET_PROFILE", payload: profileData });
      }
    } catch (err) {
      // Only dispatch error if it's not an abort error
      if (err instanceof Error && !err.message?.includes("AbortError")) {
        dispatch({
          type: "SET_ERROR",
          payload: err,
        });
      }
    }
  }, [supabase, state.user?.id]);

  const value = useMemo(
    () => ({
      ...state,
      isOnboardingCompleted: state.profile?.onboarding_completed === true,
      signOut: handleSignOut,
      refreshProfile,
    }),
    [state, handleSignOut, refreshProfile],
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
