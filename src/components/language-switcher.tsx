'use client';

import { useLocaleSwitch } from "@/hooks/use-locale-switch";
import { locales } from "@/../../i18n-config";

export function LanguageSwitcher() {
    const { switchLocale, currentLocale } = useLocaleSwitch();

    return (
        <div className="flex gap-2">
            {locales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentLocale === loc
                        ? "bg-gradient-to-r from-[#33C2A1] to-[#6D5BFF] text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
