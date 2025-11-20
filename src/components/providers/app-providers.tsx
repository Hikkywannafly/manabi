"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { getQueryClient } from "@/lib/react-query/client";

interface AppProvidersProps {
  children: ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function AppProviders({
  children,
  messages,
  locale,
}: AppProvidersProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends. There is no boundary above this component,
  //       but the creation of query client is safe.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="manabi-theme">
        <AuthProvider>
          <NextIntlClientProvider
            messages={messages}
            locale={locale}
            timeZone="Asia/Ho_Chi_Minh"
          >
            {children}
          </NextIntlClientProvider>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
