"use server";

import { revalidatePath } from "next/cache";
import { redirect as nextRedirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Get the site URL for OAuth callbacks
 * Note: For internal redirects, use simple paths (middleware handles locale)
 */
function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();
  const origin = getSiteUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    nextRedirect(data.url);
  }

  return { error: "Failed to generate OAuth URL" };
}

/**
 * Sign in with email and password
 * Note: Middleware will automatically add locale to redirect path
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  nextRedirect("/dashboard");
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const origin = getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Sign out the current user
 * Note: Middleware will automatically add locale to redirect path
 */
export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  nextRedirect("/");
}

/**
 * Reset password - send reset email
 */
export async function resetPassword(email: string) {
  const supabase = await createClient();
  const origin = getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Update password (after reset)
 * Note: Middleware will automatically add locale to redirect path
 */
export async function updatePassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  nextRedirect("/dashboard");
}
