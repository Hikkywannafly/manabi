"use client";

import { IconSettings } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
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

type SidebarMode = "mini" | "expanded" | "collapsed";

const SIDEBAR_MODE_KEY = "sidebar_mode";

export function SidebarControlSettings() {
  const { setOpen, setIsMini } = useSidebar();
  const [mode, setMode] = useState<SidebarMode>("mini");

  const applyMode = React.useCallback(
    (newMode: SidebarMode) => {
      switch (newMode) {
        case "expanded":
          setOpen(true);
          setIsMini(false);
          break;
        case "collapsed":
          setOpen(false);
          setIsMini(false);
          break;
        case "mini":
          setOpen(false);
          setIsMini(true);
          break;
      }
    },
    [setOpen, setIsMini],
  );

  const handleModeChange = React.useCallback(
    (newMode: SidebarMode) => {
      setMode(newMode);
      localStorage.setItem(SIDEBAR_MODE_KEY, newMode);
      applyMode(newMode);
    },
    [applyMode],
  );

  // Load saved mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(SIDEBAR_MODE_KEY) as SidebarMode;
    if (savedMode) {
      setMode(savedMode);
      applyMode(savedMode);
    } else {
      // Default to mini mode
      applyMode("mini");
    }
  }, [applyMode]);

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
            value={mode}
            onValueChange={(value) => handleModeChange(value as SidebarMode)}
          >
            <DropdownMenuRadioItem value="mini">
              <span className="flex w-full items-center justify-between">
                Mini Sidebar
              </span>
            </DropdownMenuRadioItem>
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
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
