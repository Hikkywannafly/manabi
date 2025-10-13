import { locales, defaultLocale } from "../../i18n-config";

export const routing = {
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale,

    // Always show locale prefix
    localePrefix: "always" as const
};