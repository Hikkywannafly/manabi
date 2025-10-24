import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Manabi | Khôi phục ảnh cũ với AI",
  description:
    "Mang lại sức sống cho những bức ảnh cũ của bạn với công nghệ AI tiên tiến. Khôi phục, nâng cấp 4K, và tô màu tự động.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${poppins.className} bg-[#F9F6F2] text-[#39241A] antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}