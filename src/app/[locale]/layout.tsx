import TranslationsProvider from "@/components/TranslationsProvider";
import { getResources } from "@/lib/i18n";
import { notFound } from "next/navigation";
import i18nConfig from "../../i18nConfig";

const namespaces = [
  "common",
  "header",
  "hero",
  "benefits",
  "pricing",
  "faq",
  "footer",
];

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

  const resources = await getResources(locale, namespaces);

  return (
    <TranslationsProvider
      key={locale}
      locale={locale}
      namespaces={namespaces}
      resources={resources}
    >
      {children}
    </TranslationsProvider>
  );
}
