// "use client";

// import { useLocale } from "next-intl";
// import Link from "next/link";
// import type { ComponentProps } from "react";

// interface LocalizedLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
//   href: string;
//   locale?: string;
// }

// /**
//  * Component Link có hỗ trợ i18n tự động
//  * Tự động thêm locale prefix vào href
//  */
// export function LocalizedLink({ href, locale, ...props }: LocalizedLinkProps) {
//   const currentLocale = useLocale();
//   const targetLocale = locale || currentLocale;

//   // Đảm bảo href luôn có locale prefix
//   const localizedHref = href.startsWith("/") ? `/${targetLocale}${href}` : href;

//   return <Link {...props} href={localizedHref} />;
// }
