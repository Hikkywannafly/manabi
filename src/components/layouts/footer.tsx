"use client";

import { Camera, Globe, Instagram, Mail, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative w-full overflow-hidden bg-[#EDE5DD] dark:bg-[#1F1108]">
      {/* Top section divider */}
      <div className="absolute top-0 right-0 left-0 h-12 bg-gradient-to-b from-[#F5EFE6] to-[#EDE5DD] dark:from-[#332016] dark:to-[#1F1108]" />

      <div className="container relative z-10 mx-auto px-4 pt-24 pb-8">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B35832]/10 dark:bg-[#E2B769]/20">
                <Camera className="h-5 w-5 text-[#B35832] dark:text-[#E2B769]" />
              </div>
              <span className="font-bold text-2xl text-[#39241A] dark:text-[#F9F6F2]">
                Manabi
              </span>
            </div>
            <p className="text-[#39241A]/70 text-sm leading-relaxed dark:text-[#F9F6F2]/70">
              {t("description")}
            </p>
            <div className="flex gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full transition-colors hover:bg-[#B35832]/10 hover:text-[#B35832] dark:hover:bg-[#E2B769]/10 dark:hover:text-[#E2B769]"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full transition-colors hover:bg-[#B35832]/10 hover:text-[#B35832] dark:hover:bg-[#E2B769]/10 dark:hover:text-[#E2B769]"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full transition-colors hover:bg-[#B35832]/10 hover:text-[#B35832] dark:hover:bg-[#E2B769]/10 dark:hover:text-[#E2B769]"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg dark:text-[#F9F6F2]">
              {t("product")}
            </h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm dark:text-[#F9F6F2]/70">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Download
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg dark:text-[#F9F6F2]">
              {t("company")}
            </h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm dark:text-[#F9F6F2]/70">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg dark:text-[#F9F6F2]">
              {t("legal")}
            </h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm dark:text-[#F9F6F2]/70">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832] dark:hover:text-[#E2B769]"
                >
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-[#39241A]/10 dark:bg-[#F9F6F2]/10" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-[#39241A]/60 text-sm dark:text-[#F9F6F2]/60">
            {t("copyright")}
          </p>
          <div className="flex items-center gap-4 text-[#39241A]/60 text-sm dark:text-[#F9F6F2]/60">
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Vietnamese</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="-z-10 absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#B35832]/5 blur-3xl dark:bg-[#E2B769]/5" />
      <div className="-z-10 absolute top-0 right-0 h-80 w-80 rounded-full bg-[#E2B769]/5 blur-3xl dark:bg-[#B35832]/5" />
    </footer>
  );
}
