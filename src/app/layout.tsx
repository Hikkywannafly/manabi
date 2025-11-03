import type { Metadata } from "next";

import "./globals.css";

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
  return children;
}
