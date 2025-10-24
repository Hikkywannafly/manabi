'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Headphones } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";

export function LofiHeader() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-[#F9F6F2]/80 backdrop-blur-lg border-b border-[#E2B769]/20">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="text-2xl group-hover:rotate-6 transition-transform duration-300">
                            📸
                        </div>
                        <span className="text-xl font-bold text-[#39241A] group-hover:text-[#B35832] transition-colors">
                            Manabi
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="#features"
                            className="text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors"
                        >
                            Tính năng
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors"
                        >
                            Bảng giá
                        </Link>
                        <Link
                            href="#faq"
                            className="text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="#blog"
                            className="text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors"
                        >
                            Blog
                        </Link>
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-4">
                        {/* Lofi music toggle */}
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="rounded-full hover:bg-[#B35832]/10 group relative"
                        >
                            <Headphones
                                className={`w-5 h-5 transition-all duration-300 ${isPlaying
                                        ? 'text-[#B35832] animate-pulse'
                                        : 'text-[#39241A]/60 group-hover:text-[#B35832]'
                                    }`}
                            />
                            {isPlaying && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#B35832] rounded-full animate-ping" />
                            )}
                        </Button>

                        {/* Language switcher */}
                        <div className="hidden sm:block">
                            <LanguageSwitcher />
                        </div>

                        {/* CTA Button */}
                        <Button
                            className="hidden md:inline-flex bg-[#B35832] hover:bg-[#9d4a2a] text-white rounded-xl px-6 shadow-[0_4px_14px_rgba(179,88,50,0.3)] hover:shadow-[0_6px_20px_rgba(179,88,50,0.4)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Dùng thử miễn phí
                        </Button>

                        {/* Mobile menu button */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="md:hidden rounded-full hover:bg-[#B35832]/10"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="w-5 h-5 text-[#39241A]" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-4 border-t border-[#E2B769]/20 mt-2">
                        <Link
                            href="#features"
                            className="block text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Tính năng
                        </Link>
                        <Link
                            href="#pricing"
                            className="block text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Bảng giá
                        </Link>
                        <Link
                            href="#faq"
                            className="block text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="#blog"
                            className="block text-[#39241A]/70 hover:text-[#B35832] font-medium transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Separator className="bg-[#E2B769]/20" />
                        <div className="sm:hidden">
                            <LanguageSwitcher />
                        </div>
                        <Button
                            className="w-full bg-[#B35832] hover:bg-[#9d4a2a] text-white rounded-xl shadow-[0_4px_14px_rgba(179,88,50,0.3)]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dùng thử miễn phí
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
