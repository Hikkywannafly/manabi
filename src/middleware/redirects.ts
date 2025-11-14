import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function redirectToLogin(
  locale: string,
  pathname: string,
  request: NextRequest,
) {
  const loginUrl = new URL(`/${locale}/login`, request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export function redirectToOnboarding(locale: string, request: NextRequest) {
  return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url));
}

export function redirectToDashboard(locale: string, request: NextRequest) {
  return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
}
