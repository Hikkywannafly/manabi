"use client";

import { Headphones, Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/features"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t("features")}
            </Link>
            <Link
              href="/pricing"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t("pricing")}
            </Link>
            <Link
              href="/faq"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t("faq")}
            </Link>
            <Link
              href="/blog"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t("blog")}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Lofi music toggle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              className="group relative"
            >
              <Headphones
                className={`h-5 w-5 transition-all duration-300 ${
                  isPlaying
                    ? "animate-pulse text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              />
              {isPlaying && (
                <span className="-top-1 -right-1 absolute h-2 w-2 animate-ping rounded-full bg-primary" />
              )}
            </Button>

            {/* Theme toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Language switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Login Button */}
            <Link href="/login" className="hidden md:inline-flex">
              <Button variant="outline" className="rounded-xl">
                {t("login")}
              </Button>
            </Link>

            {/* CTA Button */}
            {/* <Link href="/get-started">
              <Button
                variant="secondary"
                className="hidden rounded-xl px-6 md:inline-flex"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {t("getStartedFree")}
              </Button>
            </Link> */}

            {/* Mobile menu button */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-2 space-y-4 border-border border-t py-4 md:hidden">
            <Link
              href="/features"
              className="block py-2 font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("features")}
            </Link>
            <Link
              href="/pricing"
              className="block py-2 font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("pricing")}
            </Link>
            <Link
              href="/faq"
              className="block py-2 font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("faq")}
            </Link>
            <Link
              href="/blog"
              className="block py-2 font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("blog")}
            </Link>
            <Separator className="bg-border" />
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
            <div className="sm:hidden">
              <LanguageSwitcher />
            </div>
            <Link href="/login" className="md:hidden">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("login")}
              </Button>
            </Link>
            <Link href="/get-started">
              <Button
                variant="gradient"
                className="w-full rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {t("getStartedFree")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
