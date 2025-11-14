export function extractLocale(pathname: string): string {
  return pathname.match(/^\/([a-z]{2})(\/|$)/)?.[1] || "en";
}

export function removeLocaleFromPath(pathname: string): string {
  return pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
}

export function checkRouteType(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}
