import type { NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES, ONBOARDING_ROUTES, PROTECTED_ROUTES } from "./constants";
import {
  redirectToDashboard,
  redirectToLogin,
  redirectToOnboarding,
} from "./redirects";
import { getProfileForMiddleware, initSupabase } from "./supabase";
import { checkRouteType, extractLocale, removeLocaleFromPath } from "./utils";

export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabase = await initSupabase(request, response);
  if (!supabase) return response;

  const pathname = request.nextUrl.pathname;
  const locale = extractLocale(pathname);
  const pathnameWithoutLocale = removeLocaleFromPath(pathname);

  // Skip middleware for API routes (check after removing locale)
  if (pathnameWithoutLocale.startsWith("/api/")) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = checkRouteType(
    pathnameWithoutLocale,
    PROTECTED_ROUTES,
  );
  const isAuthRoute = checkRouteType(pathnameWithoutLocale, AUTH_ROUTES);
  const isOnboardingRoute = checkRouteType(
    pathnameWithoutLocale,
    ONBOARDING_ROUTES,
  );
  const isHomePage = pathnameWithoutLocale === "/";

  // Not authenticated - redirect to login
  if ((isProtectedRoute || isOnboardingRoute) && !user) {
    return redirectToLogin(locale, pathname, request);
  }

  // User authenticated - handle route logic
  if (
    user &&
    (isProtectedRoute || isOnboardingRoute || isAuthRoute || isHomePage)
  ) {
    try {
      const { data: profile, error } = await getProfileForMiddleware(
        supabase,
        user.id,
      );

      // Profile should always exist due to trigger, but handle error gracefully
      if (error) {
        console.error("Profile fetch error:", error);
        // If profile doesn't exist (shouldn't happen), redirect to onboarding
        if (error.code === "PGRST116" && !isOnboardingRoute) {
          return redirectToOnboarding(locale, request);
        }
        return response;
      }

      const onboardingCompleted = profile?.onboarding_completed === true;

      // Redirect flow:
      // 1. Protected route (dashboard, etc.) → check onboarding
      if (isProtectedRoute && !onboardingCompleted) {
        return redirectToOnboarding(locale, request);
      }

      // 2. Onboarding page → if completed, go to dashboard
      if (isOnboardingRoute && onboardingCompleted) {
        return redirectToDashboard(locale, request);
      }

      // 3. Login page → if completed, go to dashboard; if not, go to onboarding
      if (isAuthRoute) {
        if (onboardingCompleted) {
          return redirectToDashboard(locale, request);
        } else {
          return redirectToOnboarding(locale, request);
        }
      }

      // 4. Home page → if not completed, go to onboarding; if completed, go to dashboard
      if (isHomePage) {
        if (!onboardingCompleted) {
          return redirectToOnboarding(locale, request);
        } else {
          return redirectToDashboard(locale, request);
        }
      }
    } catch (err) {
      console.error("Middleware error:", err);
    }
  }

  return response;
}
