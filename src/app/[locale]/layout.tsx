import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import i18nConfig from "../../i18nConfig";
import "../globals.css";

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
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
        className={`${nunito.variable} bg-[#F9F6F2] font-sans text-[#39241A] antialiased`}
      >
        <Analytics />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
