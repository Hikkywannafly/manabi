import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Manabi | Smart Learning Platform",
  description:
    "Manabi learning platform helps you create roadmaps, practice, and track progress effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} bg-[#F9F6F2] text-[#39241A] antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
