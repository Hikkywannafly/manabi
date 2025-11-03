"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, Globe, Instagram, Mail, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative w-full overflow-hidden bg-[#EDE5DD]">
      {/* Top section divider */}
      <div className="absolute top-0 right-0 left-0 h-12 bg-gradient-to-b from-[#F5EFE6] to-[#EDE5DD]" />

      <div className="container relative z-10 mx-auto px-4 pt-24 pb-8">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B35832]/10">
                <Camera className="h-5 w-5 text-[#B35832]" />
              </div>
              <span className="font-bold text-2xl text-[#39241A]">Manabi</span>
            </div>
            <p className="text-[#39241A]/70 text-sm leading-relaxed">
              {t("description")}
            </p>
            <div className="flex gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full transition-colors hover:bg-[#B35832]/10 hover:text-[#B35832]"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full transition-colors hover:bg-[#B35832]/10 hover:text-[#B35832]"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full transition-colors hover:bg-[#B35832]/10 hover:text-[#B35832]"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg">
              {t("product")}
            </h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Download
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg">
              {t("company")}
            </h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg">
              {t("legal")}
            </h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm">
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors hover:text-[#B35832]"
                >
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-[#39241A]/10" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-[#39241A]/60 text-sm">{t("copyright")}</p>
          <div className="flex items-center gap-4 text-[#39241A]/60 text-sm">
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
      <div className="-z-10 absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#B35832]/5 blur-3xl" />
      <div className="-z-10 absolute top-0 right-0 h-80 w-80 rounded-full bg-[#E2B769]/5 blur-3xl" />
    </footer>
  );
}
