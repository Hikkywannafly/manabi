"use client";

import { IconSettings } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

type SidebarState = "expanded" | "collapsed" | "expand-on-hover";

export function SidebarControlSettings() {
  const { state, setOpen } = useSidebar();

  const handleStateChange = (newState: SidebarState) => {
    if (newState === "expanded") {
      setOpen(true);
    } else if (newState === "collapsed") {
      setOpen(false);
    }
    // "expand-on-hover" would be handled differently depending on your sidebar implementation
  };

  const currentState = state === "collapsed" ? "collapsed" : "expanded";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          title="Sidebar control settings"
        >
          <IconSettings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-48">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Sidebar control
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={currentState}
            onValueChange={handleStateChange as (value: string) => void}
          >
            <DropdownMenuRadioItem value="expanded">
              <span className="flex w-full items-center justify-between">
                Expanded
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="collapsed">
              <span className="flex w-full items-center justify-between">
                Collapsed
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="expand-on-hover">
              <span className="flex w-full items-center justify-between">
                Expand on hover
              </span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
