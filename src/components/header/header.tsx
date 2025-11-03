"use client";

import { Camera, Headphones, Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
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
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:rotate-6">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-foreground text-xl transition-colors group-hover:text-primary">
              Manabi
            </span>
          </Link>

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
              className="group relative rounded-full hover:bg-primary/10"
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

            {/* CTA Button */}
            <Link href="/get-started">
              <Button className="hover:-translate-y-0.5 hidden rounded-xl bg-primary px-6 text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 md:inline-flex">
                <Sparkles className="mr-2 h-4 w-4" />
                {t("getStartedFree")}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-primary/10 md:hidden"
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
            <Link href="/get-started">
              <Button
                className="w-full rounded-xl bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
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
