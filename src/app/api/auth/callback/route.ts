import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler
 * Handles the OAuth redirect after successful authentication
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  // Extract locale from referer or use default
  const referer = request.headers.get("referer");
  const locale = referer?.match(/\/([a-z]{2})(\/|$)/)?.[1] || "en";

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}/${locale}${next}`);
    }

    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/${locale}/login?error=${encodeURIComponent(error.message)}`,
    );
  }
  return NextResponse.redirect(`${requestUrl.origin}/${locale}/login`);
}
