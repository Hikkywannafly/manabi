'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function useLocaleSwitch() {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const switchLocale = (newLocale: 'vi' | 'en') => {
        // Save locale to cookie
        document.cookie = `edumentum-locale=${newLocale}; path=/; max-age=31536000`; // 1 year

        // Get the pathname without locale prefix
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

        // Navigate to new locale
        router.push(`/${newLocale}${pathWithoutLocale}`);
    };

    return { switchLocale, currentLocale };
}