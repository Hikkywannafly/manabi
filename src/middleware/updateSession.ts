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

  if (pathname.startsWith("/api/")) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = extractLocale(pathname);
  const pathnameWithoutLocale = removeLocaleFromPath(pathname);

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

      if (error) {
        // Profile not found - new user without onboarding yet
        if (error.code === "PGRST116") {
          // Allow access to onboarding page for new users
          if (isOnboardingRoute) {
            return response;
          }
          // Redirect to onboarding if trying to access protected/home/login pages
          if (isProtectedRoute || isHomePage || isAuthRoute) {
            return redirectToOnboarding(locale, request);
          }
          return response;
        }
        console.error("Profile fetch error:", error);
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
