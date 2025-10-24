'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";

const faqs = [
    {
        question: "Manabi có miễn phí không?",
        answer: "Có! Bạn có thể dùng thử miễn phí với 5 ảnh đầu tiên. Sau đó, bạn có thể nâng cấp lên gói Premium để khôi phục không giới hạn với nhiều tính năng cao cấp hơn."
    },
    {
        question: "AI khôi phục ảnh có chính xác không?",
        answer: "Công nghệ AI của chúng tôi được đào tạo trên hàng triệu bức ảnh lịch sử. Độ chính xác lên đến 95% với khả năng tự động điều chỉnh màu sắc, độ nét và loại bỏ khuyết điểm."
    },
    {
        question: "Ảnh của tôi có được bảo mật không?",
        answer: "Tất nhiên rồi! Mọi ảnh đều được mã hóa end-to-end và lưu trữ trên server bảo mật. Chỉ bạn mới có quyền truy cập. Bạn có thể xóa ảnh bất cứ lúc nào."
    },
    {
        question: "Tôi có thể khôi phục ảnh đen trắng thành màu không?",
        answer: "Có! Tính năng 'Color Revive' của Manabi sử dụng AI để tự động tô màu tự nhiên cho ảnh đen trắng dựa trên bối cảnh và đối tượng trong ảnh."
    },
    {
        question: "Mất bao lâu để xử lý một bức ảnh?",
        answer: "Trung bình chỉ mất 5-10 giây cho mỗi ảnh ở chế độ Standard, và 20-30 giây cho chế độ 4K Ultra HD tùy thuộc vào độ phức tạp của ảnh."
    },
    {
        question: "Tôi có thể tải ảnh gốc về không?",
        answer: "Có! Bạn có thể tải xuống ảnh đã khôi phục ở độ phân giải cao nhất (lên đến 4K) và giữ nguyên file gốc nếu muốn so sánh hoặc lưu trữ."
    }
];

export function LofiFAQ() {
    return (
        <section className="relative w-full py-24 bg-[#F5EFE6] overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />

            <div className="container relative z-10 mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2B769]/20 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#B35832]" />
                        <span className="text-sm font-medium text-[#39241A]">
                            Câu hỏi thường gặp
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#39241A]">
                        Giải đáp thắc mắc
                    </h2>
                    <p className="text-lg text-[#39241A]/70 max-w-2xl mx-auto">
                        Những câu hỏi phổ biến từ người dùng về Manabi
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-white/80 backdrop-blur-sm border border-[#E2B769]/20 rounded-2xl px-6 shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_25px_rgba(179,88,50,0.1)] transition-all duration-300"
                            >
                                <AccordionTrigger className="text-left text-[#39241A] font-semibold hover:text-[#B35832] transition-colors py-6 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-[#39241A]/70 leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* CTA below FAQ */}
                <div className="text-center mt-12">
                    <p className="text-[#39241A]/60 mb-4">
                        Vẫn còn thắc mắc? Chúng tôi luôn sẵn sàng giúp đỡ!
                    </p>
                    <a
                        href="mailto:support@manabi.com"
                        className="inline-flex items-center gap-2 text-[#B35832] font-semibold hover:text-[#9d4a2a] transition-colors"
                    >
                        Liên hệ hỗ trợ →
                    </a>
                </div>
            </div>
        </section>
    );
}
