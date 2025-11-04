import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler
 * Handles the OAuth redirect after successful authentication
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const locale = requestUrl.searchParams.get("locale") || "en";
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectPath = next.startsWith("/") ? next : `/${next}`;
      const redirectUrl = redirectPath.startsWith(`/${locale}`)
        ? `${origin}${redirectPath}`
        : `${origin}/${locale}${redirectPath}`;
      return NextResponse.redirect(redirectUrl);
    }

    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${origin}/${locale}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/${locale}/login`);
}
