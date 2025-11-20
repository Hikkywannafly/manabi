import { Analytics } from "@vercel/analytics/react";
import { Nunito } from "next/font/google";
import { notFound } from "next/navigation";

import { getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";
import { AppProviders } from "@/components/providers/app-providers";
import i18nConfig from "../../i18nConfig";

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (
    !i18nConfig.locales.includes(locale as (typeof i18nConfig.locales)[number])
  ) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${nunito.variable} bg-[#F9F6F2] font-sans text-[#39241A] antialiased dark:bg-[#2A1810] dark:text-[#F9F6F2]`}
      >
        <NextTopLoader />
        <Analytics />
        <AppProviders messages={messages} locale={locale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
