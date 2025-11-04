import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ClerkUser = {
  imageUrl?: string;
  fullName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
};

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: ClerkUser | User | null;
}

// Type guard to check if user is Supabase User
function isSupabaseUser(user: ClerkUser | User | null): user is User {
  return user !== null && "email" in user && "id" in user;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  // Handle both Supabase User and Clerk-like user structure
  const imageUrl = isSupabaseUser(user)
    ? user.user_metadata?.avatar_url
    : user?.imageUrl;

  const fullName = isSupabaseUser(user)
    ? user.user_metadata?.full_name || user.email?.split("@")[0]
    : user?.fullName;

  const email = isSupabaseUser(user)
    ? user.email
    : user?.emailAddresses?.[0]?.emailAddress;

  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage src={imageUrl || ""} alt={fullName || ""} />
        <AvatarFallback className="rounded-lg">
          {fullName?.slice(0, 2)?.toUpperCase() || "CN"}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{fullName || ""}</span>
          <span className="truncate text-xs">{email || ""}</span>
        </div>
      )}
    </div>
  );
}
