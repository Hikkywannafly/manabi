"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, Headphones, Menu, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-50 w-full border-[#E2B769]/20 border-b bg-[#F9F6F2]/80 backdrop-blur-lg dark:border-[#E2B769]/10 dark:bg-[#2A1810]/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B35832]/10 transition-transform duration-300 group-hover:rotate-6 dark:bg-[#E2B769]/20">
              <Camera className="h-5 w-5 text-[#B35832] dark:text-[#E2B769]" />
            </div>
            <span className="font-bold text-[#39241A] text-xl transition-colors group-hover:text-[#B35832] dark:text-[#F9F6F2] dark:group-hover:text-[#E2B769]">
              Manabi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/features"
              className="font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
            >
              {t("features")}
            </Link>
            <Link
              href="/pricing"
              className="font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
            >
              {t("pricing")}
            </Link>
            <Link
              href="/faq"
              className="font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
            >
              {t("faq")}
            </Link>
            <Link
              href="/blog"
              className="font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
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
              className="group relative rounded-full hover:bg-[#B35832]/10"
            >
              <Headphones
                className={`h-5 w-5 transition-all duration-300 ${
                  isPlaying
                    ? "animate-pulse text-[#B35832]"
                    : "text-[#39241A]/60 group-hover:text-[#B35832] dark:text-[#F9F6F2]/60"
                }`}
              />
              {isPlaying && (
                <span className="-top-1 -right-1 absolute h-2 w-2 animate-ping rounded-full bg-[#B35832]" />
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
              <Button className="hover:-translate-y-0.5 hidden rounded-xl bg-[#B35832] px-6 text-white shadow-[0_4px_14px_rgba(179,88,50,0.3)] transition-all duration-300 hover:bg-[#9d4a2a] hover:shadow-[0_6px_20px_rgba(179,88,50,0.4)] md:inline-flex">
                <Sparkles className="mr-2 h-4 w-4" />
                {t("getStartedFree")}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-[#B35832]/10 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-[#39241A] dark:text-[#F9F6F2]" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-2 space-y-4 border-[#E2B769]/20 border-t py-4 md:hidden dark:border-[#E2B769]/10">
            <Link
              href="/features"
              className="block py-2 font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("features")}
            </Link>
            <Link
              href="/pricing"
              className="block py-2 font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("pricing")}
            </Link>
            <Link
              href="/faq"
              className="block py-2 font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("faq")}
            </Link>
            <Link
              href="/blog"
              className="block py-2 font-medium text-[#39241A]/70 transition-colors hover:text-[#B35832] dark:text-[#F9F6F2]/70 dark:hover:text-[#E2B769]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("blog")}
            </Link>
            <Separator className="bg-[#E2B769]/20 dark:bg-[#E2B769]/10" />
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
            <div className="sm:hidden">
              <LanguageSwitcher />
            </div>
            <Link href="/get-started">
              <Button
                className="w-full rounded-xl bg-[#B35832] text-white shadow-[0_4px_14px_rgba(179,88,50,0.3)] hover:bg-[#9d4a2a]"
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
