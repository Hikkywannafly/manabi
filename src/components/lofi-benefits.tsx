'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, ImageUp, Palette, Cloud, Sparkles, Zap } from "lucide-react";

const features = [
    {
        icon: Wand2,
        title: "Khôi phục một chạm",
        description: "AI tự động phân tích và sửa chữa các khuyết điểm trong ảnh cũ chỉ với một cú nhấp chuột.",
        color: "text-[#B35832]"
    },
    {
        icon: ImageUp,
        title: "Nâng cấp 4K",
        description: "Tăng độ phân giải lên đến 4K, mang lại sự sắc nét hoàn hảo cho những bức ảnh mờ nhạt.",
        color: "text-[#E2B769]"
    },
    {
        icon: Palette,
        title: "Phục hồi màu sắc",
        description: "Tự động tô màu cho ảnh đen trắng hoặc phục hồi màu sắc bị phai mờ theo thời gian.",
        color: "text-[#B35832]"
    },
    {
        icon: Cloud,
        title: "Lưu trữ đám mây",
        description: "Bảo quản an toàn những kỷ niệm quý giá của bạn trên cloud với mã hóa cao cấp.",
        color: "text-[#E2B769]"
    },
    {
        icon: Sparkles,
        title: "Xóa nhiễu & vết bẩn",
        description: "Loại bỏ các vết xước, vết bẩn, và nhiễu hạt một cách tự nhiên và chính xác.",
        color: "text-[#B35832]"
    },
    {
        icon: Zap,
        title: "Xử lý siêu nhanh",
        description: "Công nghệ AI tối ưu giúp xử lý hàng loạt ảnh trong vài giây.",
        color: "text-[#E2B769]"
    }
];

export function LofiBenefits() {
    return (
        <section className="relative w-full py-24 bg-[#F9F6F2] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-[#E2B769]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#B35832]/10 rounded-full blur-3xl" />

            <div className="container relative z-10 mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5EFE6] border border-[#E2B769]/20 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#B35832]" />
                        <span className="text-sm font-medium text-[#39241A]">
                            Tính năng nổi bật
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#39241A]">
                        Công nghệ AI đỉnh cao
                    </h2>
                    <p className="text-lg text-[#39241A]/70 max-w-2xl mx-auto">
                        Mang đến những công cụ mạnh mẽ để bạn khôi phục và làm đẹp ảnh cũ một cách dễ dàng
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="group bg-white/80 backdrop-blur-sm border-[#E2B769]/20 shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(179,88,50,0.15)] transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden"
                            >
                                <CardHeader className="space-y-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-[#F5EFE6] to-[#E2B769]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-7 h-7 ${feature.color}`} />
                                    </div>
                                    <CardTitle className="text-xl text-[#39241A] font-semibold">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-[#39241A]/70 leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>

                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#E2B769]/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Wavy divider bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full h-12 fill-[#F5EFE6]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
                </svg>
            </div>
        </section>
    );
}
