"use client";

import { IconBell, IconSearch } from "@tabler/icons-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "./user-dropdown";

export function DashboardHeader() {
  return (
    <header className="w-full shrink-0 bg-background">
      <div className="px-4 xl:px-8">
        <div className="container mx-auto max-w-8xl p-0">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Sidebar Trigger + Search */}
            <div className="flex flex-1 items-center gap-4">
              {/* Sidebar Trigger - Only on mobile */}
              <SidebarTrigger className="md:hidden" />

              {/* Search Bar */}
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <IconSearch className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="relative">
                    <IconBell className="h-5 w-5" />
                    <Badge
                      variant="destructive"
                      className="-right-1 absolute top-1 h-5 min-w-5 px-1 text-xs"
                    >
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2">
                    <h3 className="mb-2 font-semibold">Notifications</h3>
                    <div className="space-y-2">
                      <DropdownMenuItem className="flex flex-col items-start p-3">
                        <div className="font-medium">New message</div>
                        <div className="text-muted-foreground text-sm">
                          You have a new message from John
                        </div>
                        <div className="mt-1 text-muted-foreground text-xs">
                          2 minutes ago
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start p-3">
                        <div className="font-medium">Task completed</div>
                        <div className="text-muted-foreground text-sm">
                          Your task has been completed successfully
                        </div>
                        <div className="mt-1 text-muted-foreground text-xs">
                          1 hour ago
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start p-3">
                        <div className="font-medium">System update</div>
                        <div className="text-muted-foreground text-sm">
                          A new system update is available
                        </div>
                        <div className="mt-1 text-muted-foreground text-xs">
                          2 hours ago
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* User Dropdown */}
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
