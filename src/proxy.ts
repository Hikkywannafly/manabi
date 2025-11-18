import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./middleware/updateSession";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip i18n routing for API routes - they should never have locale prefix
  if (pathname.startsWith("/api/")) {
    return updateSession(request, NextResponse.next());
  }

  const response = handleI18nRouting(request);

  return updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
