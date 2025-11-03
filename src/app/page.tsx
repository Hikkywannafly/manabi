import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Check for saved locale in cookie (next-intl uses NEXT_LOCALE by default)
  const savedLocale = cookieStore.get("NEXT_LOCALE")?.value;

  if (savedLocale === "en" || savedLocale === "vi") {
    redirect(`/${savedLocale}`);
  }

  // Fallback to accept-language header
  const acceptLanguage = headersList.get("accept-language") || "";
  const prefersVietnamese = acceptLanguage.toLowerCase().includes("vi");

  // Redirect to preferred locale
  redirect(prefersVietnamese ? "/vi" : "/en");
}
