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
  contentNavItems,
  navItems,
  studyToolsNavItems,
} from "@/constants/data";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { SidebarControlSettings } from "./sidebar-control-settings";
import { SidebarNavGroup } from "./sidebar-nav-group";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="transition-[padding] duration-300 ease-in-out group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:group-data-[mini=true]:group-hover/sidebar-container:px-2">
        <Logo
          size="md"
          className="transition-[gap] duration-300 ease-in-out group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:group-data-[mini=true]:group-hover/sidebar-container:gap-2"
          textClassName={cn(
            "transition-[max-width,opacity] duration-300 ease-in-out",
            "group-data-[collapsible=icon]:inline-block group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:opacity-0",
            "group-data-[collapsible=icon]:group-data-[mini=true]:group-hover/sidebar-container:max-w-[200px] group-data-[collapsible=icon]:group-data-[mini=true]:group-hover/sidebar-container:opacity-100",
          )}
        />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarControlSettings />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
