'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Instagram, Twitter, Mail, Heart } from "lucide-react";
import Link from "next/link";

export function LofiFooter() {
    return (
        <footer className="relative w-full bg-[#EDE5DD] overflow-hidden">
            {/* Top wavy divider */}
            <div className="absolute top-0 left-0 right-0 transform rotate-180">
                <svg className="w-full h-12 fill-[#EDE5DD]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
                </svg>
            </div>

            <div className="container relative z-10 mx-auto px-4 pt-24 pb-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="text-2xl">📸</div>
                            <span className="text-2xl font-bold text-[#39241A]">Manabi</span>
                        </div>
                        <p className="text-sm text-[#39241A]/70 leading-relaxed">
                            Khôi phục ký ức cũ, lưu giữ khoảnh khắc đẹp.
                            Công nghệ AI giúp bạn mang những bức ảnh xưa trở lại cuộc sống.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full hover:bg-[#B35832]/10 hover:text-[#B35832] transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full hover:bg-[#B35832]/10 hover:text-[#B35832] transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full hover:bg-[#B35832]/10 hover:text-[#B35832] transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Product column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-[#39241A] text-lg">Sản phẩm</h3>
                        <ul className="space-y-3 text-sm text-[#39241A]/70">
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Tính năng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Bảng giá
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    API
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Tải xuống
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-[#39241A] text-lg">Công ty</h3>
                        <ul className="space-y-3 text-sm text-[#39241A]/70">
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-[#39241A] text-lg">Pháp lý</h3>
                        <ul className="space-y-3 text-sm text-[#39241A]/70">
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#B35832] transition-colors">
                                    Bản quyền
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-[#39241A]/10" />

                {/* Bottom section */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[#39241A]/60">
                        © 2025 Manabi — Made with{" "}
                        <Heart className="inline w-4 h-4 text-[#B35832] fill-current" />{" "}
                        and nostalgia
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#39241A]/60">
                        <span>Vietnamese 🇻🇳</span>
                        <span>•</span>
                        <span>English 🇺🇸</span>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B35832]/5 rounded-full blur-3xl -z-10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E2B769]/5 rounded-full blur-3xl -z-10" />
        </footer>
    );
}
