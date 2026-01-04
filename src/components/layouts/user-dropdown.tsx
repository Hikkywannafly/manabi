"use client";

import {
  IconBell,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "@/app/api/auth/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import { useUser } from "@/contexts/auth-provider";

interface UserDropdownProps {
  variant?: "sidebar" | "header";
}

export function UserDropdown({ variant = "sidebar" }: UserDropdownProps) {
  const { user, profile } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (!user) return null;

  // Merge profile data with auth user for avatar display
  const displayUser = profile
    ? {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          full_name: profile.full_name || profile.nickname,
          avatar_url: profile.avatar_url,
        },
      }
    : user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "header" ? (
          <Button size="icon" className="rounded-full">
            <UserAvatarProfile
              className="h-8 w-8 rounded-full"
              showInfo={false}
              user={displayUser}
            />
          </Button>
        ) : (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserAvatarProfile
              className="h-8 w-8 rounded-full"
              showInfo
              user={displayUser}
            />
            <IconChevronsDown className="ml-auto size-4" />
          </SidebarMenuButton>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="px-1 py-1.5">
            <UserAvatarProfile
              className="h-8 w-8 rounded-full"
              showInfo
              user={displayUser}
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigate("/dashboard/profile")}
          >
            <IconUserCircle className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleNavigate("/dashboard/billing")}
          >
            <IconCreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleNavigate("/dashboard/notifications")}
          >
            <IconBell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          <IconLogout className="mr-2 h-4 w-4" />
          {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
