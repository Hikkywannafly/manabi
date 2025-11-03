"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("header");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      className="group relative rounded-full transition-all duration-300 hover:bg-[#B35832]/10"
      aria-label={t("themeToggle")}
    >
      <Sun className="dark:-rotate-90 h-5 w-5 rotate-0 scale-100 text-[#39241A]/60 transition-all duration-300 group-hover:text-[#B35832] dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 text-[#39241A]/60 transition-all duration-300 group-hover:text-[#B35832] dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
