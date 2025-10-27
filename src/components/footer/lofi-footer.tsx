'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, Globe, Heart, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function LofiFooter() {
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
              Khôi phục ký ức cũ, lưu giữ khoảnh khắc đẹp.
              Công nghệ AI giúp bạn mang những bức ảnh xưa trở lại cuộc sống.
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
            <h3 className="font-semibold text-[#39241A] text-lg">Sản phẩm</h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Tính năng
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Tải xuống
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg">Công ty</h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#39241A] text-lg">Pháp lý</h3>
            <ul className="space-y-3 text-[#39241A]/70 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-[#B35832]">
                  Bản quyền
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-[#39241A]/10" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-[#39241A]/60 text-sm">
            © 2025 Manabi — Made with{" "}
            <Heart className="inline h-4 w-4 fill-current text-[#B35832]" />{" "}
            and nostalgia
          </p>
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
