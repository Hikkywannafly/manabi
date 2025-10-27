'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

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
    <section className="relative w-full overflow-hidden bg-[#F5EFE6] py-24" id="pricing">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#E2B769]/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-[#B35832]/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <div className="mb-16 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B769]/20 bg-white px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#B35832]" />
            <span className="font-medium text-[#39241A] text-sm">
              Bảng giá
            </span>
          </div>
          <h2 className="font-bold text-4xl text-[#39241A] md:text-5xl">
            Chọn gói phù hợp với bạn
          </h2>
          <p className="mx-auto max-w-2xl text-[#39241A]/70 text-lg">
            Linh hoạt từ miễn phí đến doanh nghiệp. Không ràng buộc, hủy bất cứ lúc nào.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`hover:-translate-y-2 relative overflow-hidden rounded-3xl border-2 bg-white/80 backdrop-blur-sm transition-all duration-500 ${plan.popular
                ? "scale-105 border-[#B35832] shadow-[0_0_40px_rgba(179,88,50,0.2)]"
                : 'border-[#E2B769]/20 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(179,88,50,0.15)]'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0">
                  <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-[#B35832] to-[#E2B769] py-2 text-center font-semibold text-sm text-white">
                    <Sparkles className="h-4 w-4" />
                    Phổ biến nhất
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
                  <span className="font-bold text-5xl text-[#B35832]">
                    {plan.price === "0" ? "Free" : `${plan.price}₫`}
                  </span>
                  {plan.price !== "0" && (
                    <span className="mb-2 text-[#39241A]/60">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${plan.popular ? 'bg-[#B35832]' : 'bg-[#E2B769]'
                        }`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-[#39241A]/80 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4 pb-8">
                <Link href={plan.name === 'Free' ? '/get-started' : plan.name === 'Business' ? '/contact' : '/subscribe/pro'} className="w-full">
                  <Button
                    className={`w-full rounded-xl py-6 font-semibold text-base transition-all duration-300 ${plan.popular
                      ? "hover:-translate-y-1 bg-[#B35832] text-white shadow-[0_6px_20px_rgba(179,88,50,0.3)] hover:bg-[#9d4a2a] hover:shadow-[0_8px_30px_rgba(179,88,50,0.4)]"
                      : "border-2 border-[#E2B769] bg-[#F5EFE6] text-[#B35832] hover:bg-[#E2B769]/30"
                      }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>

              {/* Decorative corner */}
              {plan.popular && (
                <div className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-gradient-to-tl from-[#E2B769]/20 to-transparent" />
              )}
            </Card>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 space-y-2 text-center">
          <p className="text-[#39241A]/60">
            Tất cả gói đều bao gồm bản cập nhật miễn phí và không giới hạn thiết bị
          </p>
          <p className="text-[#39241A]/50 text-sm">
            Thanh toán an toàn qua Stripe • Hủy bất cứ lúc nào • Không phí ẩn
          </p>
        </div>
      </div>
    </section>
  );
}
