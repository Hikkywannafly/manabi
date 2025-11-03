import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import i18nConfig from "../../i18nConfig";

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
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
