import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler
 * Handles the OAuth redirect after successful authentication
 * Note: Locale handling is done by the middleware (proxy.ts)
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Middleware will handle routing based on onboarding status
      // Use 303 for POST-Redirect-GET pattern
      return NextResponse.redirect(new URL(next, requestUrl.origin), 303);
    }

    console.error("Auth callback error:", error);
    // Middleware will add locale automatically
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message)}`,
        requestUrl.origin,
      ),
      303,
    );
  }

  // Middleware will add locale automatically
  return NextResponse.redirect(new URL("/login", requestUrl.origin), 303);
}
