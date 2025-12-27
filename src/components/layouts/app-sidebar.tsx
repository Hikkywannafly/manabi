"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  accountNavItems,
  communityNavItems,
  contentNavItems,
  navItems,
  planningNavItems,
  socialNavItems,
  studyToolsNavItems,
} from "@/constants/data";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { SidebarControlSettings } from "./sidebar-control-settings";
import { SidebarFreePlanLimit } from "./sidebar-free-plan-limit";
import { SidebarNavGroup } from "./sidebar-nav-group";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Use standard padding to align with sidebar items */}
      <SidebarHeader>
        <Logo
          size="md"
          className=""
          textClassName={cn(
            "transition-[max-width,opacity] duration-300 ease-in-out",
            "group-data-[collapsible=icon]:inline-block group-data-[collapsible=icon]:max-w-[200px] group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:opacity-0",
            "group-data-[collapsible=icon]:group-data-[mini=true]:group-hover/sidebar-container:max-w-[200px] group-data-[collapsible=icon]:group-data-[mini=true]:group-hover/sidebar-container:opacity-100 group-data-[collapsible=icon]:group-data-[mini=true]:group-hover/sidebar-container:delay-100",
          )}
        />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sidebar-border/50 hover:[&::-webkit-scrollbar-thumb]:bg-sidebar-border [&::-webkit-scrollbar]:w-1.5">
        {/* Overview Section */}
        <SidebarGroup>
          <SidebarGroupLabel>OVERVIEW</SidebarGroupLabel>
          <SidebarNavGroup items={navItems} pathname={pathname} />
        </SidebarGroup>

        {/* Content Creation Section */}
        <SidebarGroup>
          <SidebarGroupLabel>CONTENT CREATION</SidebarGroupLabel>
          <SidebarNavGroup items={contentNavItems} pathname={pathname} />
        </SidebarGroup>

        {/* Study Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel>STUDY TOOLS</SidebarGroupLabel>
          <SidebarNavGroup items={studyToolsNavItems} pathname={pathname} />
        </SidebarGroup>

        {/* Planning & Organization Section */}
        <SidebarGroup>
          <SidebarGroupLabel>PLANNING & ORGANIZATION</SidebarGroupLabel>
          <SidebarNavGroup items={planningNavItems} pathname={pathname} />
        </SidebarGroup>

        {/* Social & Progress Section */}
        <SidebarGroup>
          <SidebarGroupLabel>SOCIAL & PROGRESS</SidebarGroupLabel>
          <SidebarNavGroup items={socialNavItems} pathname={pathname} />
        </SidebarGroup>

        {/* Account Section */}
        {/* Note: Account section in HTML is collapsible. SidebarGroup is not collapsible by default unless implemented.
            Here we just render it as a group. If collapsible behavior is absolutely required for the group itself,
            we would need a SidebarGroupCollapsible component. However, SidebarNavGroup/SidebarGroup usually serve this.
        */}
        <SidebarGroup>
          <SidebarGroupLabel>ACCOUNT</SidebarGroupLabel>
          <SidebarNavGroup items={accountNavItems} pathname={pathname} />
        </SidebarGroup>

        {/* Community Section */}
        <SidebarGroup>
          <SidebarGroupLabel>COMMUNITY</SidebarGroupLabel>
          <SidebarNavGroup items={communityNavItems} pathname={pathname} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mb-4">
            <SidebarFreePlanLimit />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarControlSettings />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
