'use client';

import { useLocaleSwitch } from "@/hooks/use-locale-switch";
import { locales } from "../../i18n-config";

export function LanguageSwitcher() {
    const { switchLocale, currentLocale } = useLocaleSwitch();

    return (
        <div className="flex gap-2">
            {locales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentLocale === loc
                        ? "bg-[#B35832] text-white shadow-sm"
                        : "bg-[#F5EFE6] text-[#39241A] hover:bg-[#E2B769]/30"
                        }`}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
