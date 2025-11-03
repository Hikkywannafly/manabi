import { i18nRouter } from "next-i18n-router";
import type { NextRequest, NextResponse } from "next/server";
import i18nConfig from "./i18nConfig";

export function middleware(request: NextRequest): NextResponse | undefined {
  return i18nRouter(request, i18nConfig);
}

// applies this middleware only to files in the app directory
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
