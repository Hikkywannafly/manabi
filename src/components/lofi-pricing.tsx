'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "0",
        period: "miễn phí",
        description: "Dùng thử để trải nghiệm sức mạnh AI",
        features: [
            "5 ảnh miễn phí",
            "Khôi phục cơ bản",
            "Xuất ảnh HD (1080p)",
            "Lưu trữ 7 ngày",
            "Hỗ trợ email"
        ],
        cta: "Bắt đầu miễn phí",
        popular: false
    },
    {
        name: "Pro",
        price: "199.000",
        period: "/tháng",
        description: "Dành cho người dùng cá nhân thường xuyên",
        features: [
            "100 ảnh/tháng",
            "Khôi phục cao cấp + AI tô màu",
            "Xuất ảnh 4K Ultra HD",
            "Lưu trữ vĩnh viễn",
            "Loại bỏ logo watermark",
            "Hỗ trợ ưu tiên 24/7"
        ],
        cta: "Nâng cấp Pro",
        popular: true
    },
    {
        name: "Business",
        price: "499.000",
        period: "/tháng",
        description: "Cho studio và doanh nghiệp",
        features: [
            "Không giới hạn ảnh",
            "API access",
            "Xử lý hàng loạt",
            "Bộ lọc tùy chỉnh",
            "Quản lý team",
            "SLA 99.9% uptime",
            "Account manager riêng"
        ],
        cta: "Liên hệ sales",
        popular: false
    }
];

export function LofiPricing() {
    return (
        <section className="relative w-full py-24 bg-[#F5EFE6] overflow-hidden" id="pricing">
            {/* Background decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E2B769]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B35832]/10 rounded-full blur-3xl" />

            <div className="container relative z-10 mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2B769]/20 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#B35832]" />
                        <span className="text-sm font-medium text-[#39241A]">
                            Bảng giá
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#39241A]">
                        Chọn gói phù hợp với bạn
                    </h2>
                    <p className="text-lg text-[#39241A]/70 max-w-2xl mx-auto">
                        Linh hoạt từ miễn phí đến doanh nghiệp. Không ràng buộc, hủy bất cứ lúc nào.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${plan.popular
                                    ? 'border-[#B35832] shadow-[0_0_40px_rgba(179,88,50,0.2)] scale-105'
                                    : 'border-[#E2B769]/20 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(179,88,50,0.15)]'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0">
                                    <div className="bg-gradient-to-r from-[#B35832] to-[#E2B769] text-white text-center py-2 text-sm font-semibold">
                                        🔥 Phổ biến nhất
                                    </div>
                                </div>
                            )}

                            <CardHeader className={`space-y-4 ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl text-[#39241A]">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-[#39241A]/70">
                                        {plan.description}
                                    </CardDescription>
                                </div>

                                <div className="flex items-end gap-1">
                                    <span className="text-5xl font-bold text-[#B35832]">
                                        {plan.price === "0" ? "Free" : `${plan.price}₫`}
                                    </span>
                                    {plan.price !== "0" && (
                                        <span className="text-[#39241A]/60 mb-2">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-[#B35832]' : 'bg-[#E2B769]'
                                                }`}>
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-[#39241A]/80 text-sm leading-relaxed">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-4 pb-8">
                                <Button
                                    className={`w-full py-6 rounded-xl text-base font-semibold transition-all duration-300 ${plan.popular
                                            ? 'bg-[#B35832] hover:bg-[#9d4a2a] text-white shadow-[0_6px_20px_rgba(179,88,50,0.3)] hover:shadow-[0_8px_30px_rgba(179,88,50,0.4)] hover:-translate-y-1'
                                            : 'bg-[#F5EFE6] hover:bg-[#E2B769]/30 text-[#B35832] border-2 border-[#E2B769]'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </CardFooter>

                            {/* Decorative corner */}
                            {plan.popular && (
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#E2B769]/20 to-transparent rounded-tl-full" />
                            )}
                        </Card>
                    ))}
                </div>

                {/* Bottom note */}
                <div className="text-center mt-12 space-y-2">
                    <p className="text-[#39241A]/60">
                        Tất cả gói đều bao gồm bản cập nhật miễn phí và không giới hạn thiết bị
                    </p>
                    <p className="text-sm text-[#39241A]/50">
                        Thanh toán an toàn qua Stripe • Hủy bất cứ lúc nào • Không phí ẩn
                    </p>
                </div>
            </div>
        </section>
    );
}
