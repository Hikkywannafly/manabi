"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18nConfig from "@/i18nConfig";
import { Check, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const currentPathname = usePathname();

  // Extract locale from pathname
  const pathSegments = currentPathname.split("/").filter(Boolean);
  const currentLocale = i18nConfig.locales.includes(pathSegments[0])
    ? pathSegments[0]
    : i18nConfig.defaultLocale;

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // Update i18n instance
    i18n.changeLanguage(newLocale);

    // Build new path
    // Extract the path without locale prefix
    // /en or /en/page → /page or /
    const localePrefix = `/${currentLocale}`;
    let pathWithoutLocale: string;

    if (
      currentPathname === localePrefix ||
      currentPathname === `${localePrefix}/`
    ) {
      // Root page: /en or /en/
      pathWithoutLocale = "/";
    } else if (currentPathname.startsWith(`${localePrefix}/`)) {
      // Sub page: /en/page → /page
      pathWithoutLocale = currentPathname.substring(localePrefix.length);
    } else {
      // Fallback
      pathWithoutLocale = "/";
    }

    // Build new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    router.push(newPath);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-[#B35832]/10"
        >
          <Globe className="h-5 w-5 text-[#39241A]/60 hover:text-[#B35832]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className="text-lg">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {currentLocale === language.code && (
              <Check className="h-4 w-4 text-[#B35832]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
