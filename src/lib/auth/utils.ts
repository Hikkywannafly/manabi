import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Get the currently authenticated user
 * Returns null if no user is authenticated
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return !!user;
}

/**
 * Require authentication - redirect to login if not authenticated
 * Use this in server components or server actions that require authentication
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/**
 * Get user metadata
 */
export async function getUserMetadata() {
  const user = await getUser();
  return user?.user_metadata;
}

/**
 * Check if user has a specific role
 * Assumes roles are stored in user_metadata.role or app_metadata.role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const userRole =
    user.user_metadata?.role || user.app_metadata?.role || "user";
  return userRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: string[]): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const userRole =
    user.user_metadata?.role || user.app_metadata?.role || "user";
  return roles.includes(userRole);
}
