"use client";

import type { Resource } from "i18next";
import i18next from "i18next";
import type React from "react";
import { useEffect, useState } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";

interface TranslationsProviderProps {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}

let initialized = false;
let currentLocale = "";

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set html lang attribute
    document.documentElement.lang = locale;
    document.documentElement.setAttribute("lang", locale);

    // Initialize i18next only once
    if (!initialized) {
      i18next
        .use(initReactI18next)
        .init({
          lng: locale,
          resources,
          defaultNS: namespaces[0],
          fallbackNS: namespaces[0],
          ns: namespaces,
          interpolation: {
            escapeValue: false,
          },
        })
        .then(() => {
          initialized = true;
          currentLocale = locale;
          setIsReady(true);
        });
    } else if (currentLocale !== locale) {
      // Update resources SYNCHRONOUSLY before changing language
      // This prevents any chance of rendering with mismatched resources
      if (resources[locale]) {
        // First, add the default namespace
        i18next.addResourceBundle(
          locale,
          namespaces[0],
          resources[locale],
          true,
          true,
        );

        // Then add all other namespaces
        for (const namespace of namespaces) {
          if (resources[locale][namespace]) {
            i18next.addResourceBundle(
              locale,
              namespace,
              resources[locale][namespace],
              true,
              true,
            );
          }
        }
      }

      // Now change language synchronously
      i18next.changeLanguage(locale);
      currentLocale = locale;

      // Mark as ready without any state update delay
      setIsReady(true);
    }
  }, [locale, namespaces, resources]);

  if (!isReady) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
