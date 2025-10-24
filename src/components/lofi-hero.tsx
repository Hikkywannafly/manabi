'use client';

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function LofiHero() {
    const t = useTranslations('hero');

    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Subtle vignette background */}
            <div className="absolute inset-0 bg-gradient-radial from-[#F9F6F2] via-[#F5EFE6] to-[#EDE5DD] opacity-80" />

            {/* Grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

            <div className="container relative z-10 mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5EFE6] border border-[#E2B769]/20 shadow-sm">
                            <Sparkles className="w-4 h-4 text-[#B35832]" />
                            <span className="text-sm font-medium text-[#39241A]">
                                Khôi phục ký ức cũ với AI
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#39241A] leading-tight">
                            Hồi sinh những
                            <span className="block text-[#B35832] mt-2">
                                kỷ niệm xưa cũ ✨
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-[#39241A]/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Manabi giúp bạn khôi phục và làm mới những bức ảnh cũ bằng công nghệ AI tiên tiến.
                            Một chạm là đủ để mang lại sức sống mới cho kỷ niệm.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                size="lg"
                                className="bg-[#B35832] hover:bg-[#9d4a2a] text-white px-8 py-6 text-lg rounded-2xl shadow-[0_8px_30px_rgba(179,88,50,0.3)] hover:shadow-[0_8px_40px_rgba(179,88,50,0.4)] transition-all duration-300 hover:-translate-y-1"
                            >
                                Dùng thử miễn phí
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-[#B35832] text-[#B35832] hover:bg-[#B35832]/5 px-8 py-6 text-lg rounded-2xl transition-all duration-300"
                            >
                                Xem demo
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
                            <div className="text-center lg:text-left">
                                <div className="text-3xl font-bold text-[#B35832]">50K+</div>
                                <div className="text-sm text-[#39241A]/60">Ảnh đã khôi phục</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl font-bold text-[#B35832]">10K+</div>
                                <div className="text-sm text-[#39241A]/60">Người dùng hài lòng</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl font-bold text-[#B35832]">4.9/5</div>
                                <div className="text-sm text-[#39241A]/60">Đánh giá trung bình</div>
                            </div>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="relative">
                        <div className="relative aspect-square max-w-xl mx-auto">
                            {/* Decorative polaroid frame */}
                            <div className="absolute inset-0 bg-white rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.1)] transform rotate-2 transition-transform hover:rotate-0 duration-500">
                                <div className="absolute inset-4 bg-gradient-to-br from-[#F5EFE6] to-[#E2B769]/30 rounded flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl">📷</div>
                                        <p className="text-[#39241A]/60 font-medium">
                                            Before → After
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-0 right-0 text-center">
                                    <p className="text-[#39241A] font-handwriting text-lg">
                                        Ký ức năm xưa...
                                    </p>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#E2B769]/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#B35832]/10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Wavy divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full h-16 fill-[#F5EFE6]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
                </svg>
            </div>
        </section>
    );
}
