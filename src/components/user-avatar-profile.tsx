import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PartialProfile } from "@/types/db/profile";

type ClerkUser = {
  imageUrl?: string;
  fullName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
};

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: ClerkUser | User | PartialProfile | null;
}

// Type guards
function isSupabaseUser(user: any): user is User {
  return user !== null && "email" in user && "id" in user;
}

function isDbProfile(user: any): user is PartialProfile {
  return user !== null && "nickname" in user && !("email" in user);
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  // Handle Database Profile, Supabase User, and Clerk-like user structure
  const imageUrl = isDbProfile(user)
    ? user.avatar_url
    : isSupabaseUser(user)
      ? user.user_metadata?.avatar_url
      : user?.imageUrl;

  const fullName = isDbProfile(user)
    ? user.full_name || user.nickname
    : isSupabaseUser(user)
      ? user.user_metadata?.full_name || user.email?.split("@")[0]
      : user?.fullName;

  const email = isDbProfile(user)
    ? null // Profiles don't have email in PartialProfile
    : isSupabaseUser(user)
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
