'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, ImageUp, Palette, Sparkles, Wand2, Zap } from "lucide-react";

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
    <section className="relative w-full overflow-hidden bg-[#F9F6F2] py-24">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-[#E2B769]/10 blur-3xl" />
      <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-[#B35832]/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <div className="mb-16 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B769]/20 bg-[#F5EFE6] px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#B35832]" />
            <span className="font-medium text-[#39241A] text-sm">
              Tính năng nổi bật
            </span>
          </div>
          <h2 className="font-bold text-4xl text-[#39241A] md:text-5xl">
            Công nghệ AI đỉnh cao
          </h2>
          <p className="mx-auto max-w-2xl text-[#39241A]/70 text-lg">
            Mang đến những công cụ mạnh mẽ để bạn khôi phục và làm đẹp ảnh cũ một cách dễ dàng
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:-translate-y-2 overflow-hidden rounded-2xl border-[#E2B769]/20 bg-white/80 shadow-[0_0_15px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(179,88,50,0.15)]"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#F5EFE6] to-[#E2B769]/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="font-semibold text-[#39241A] text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[#39241A]/70 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-[#E2B769]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section divider bottom */}
      <div className="absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t from-[#F5EFE6] to-transparent" />
    </section>
  );
}
