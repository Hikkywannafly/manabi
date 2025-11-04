import type { Session, User } from "@supabase/supabase-js";

export type { User, Session };

export type AuthProvider = "google" | "github";

export type AuthError = {
  error: string;
};

export type AuthSuccess = {
  success: true;
};

export type AuthResult = AuthError | AuthSuccess | undefined;

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export interface UserMetadata {
  avatar_url?: string;
  full_name?: string;
  [key: string]: unknown;
}

export interface AppMetadata {
  provider?: string;
  providers?: string[];
  role?: string;
  [key: string]: unknown;
}
