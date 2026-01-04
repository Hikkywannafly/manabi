"use client";

import { format } from "date-fns";
import { Calendar, Edit, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "@/i18n/routing";
import { useProfile } from "../hooks";

export function ProfileHeader() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { user } = useAuth();
  const router = useRouter();

  if (isProfileLoading) {
    return <ProfileHeaderSkeleton />;
  }

  const joinDate = profile?.created_at
    ? format(new Date(profile.created_at), "MMMM yyyy")
    : "N/A";

  const displayName = profile?.full_name || profile?.nickname || "User";
  const email = user?.email || "No email";
  const bio =
    profile?.bio ||
    "Learning is not a race against others, but a journey of self-discovery.";

  // Banner background style
  const bannerStyle = profile?.banner_url
    ? {
        backgroundImage: `url(${profile.banner_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <Card className="w-full overflow-hidden border-none bg-transparent shadow-none">
      <div
        className="h-32 w-full bg-gradient-to-r from-primary/20 to-accent/20 md:h-48"
        style={bannerStyle}
      />
      <CardContent className="relative px-6 pt-0">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
          <Avatar className="-mt-12 md:-mt-16 relative h-24 w-24 border-4 border-background md:h-32 md:w-32">
            <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback>
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1 pt-2 md:pt-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-2xl">{displayName}</h2>
                {profile?.show_email && (
                  <p className="text-muted-foreground">{email}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                onClick={() => router.push("/dashboard/account")}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
              {bio}
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-muted-foreground text-xs">
              {profile?.timezone && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.timezone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full md:hidden"
            onClick={() => router.push("/dashboard/account")}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <Card className="w-full overflow-hidden border-none bg-transparent shadow-none">
      <Skeleton className="h-32 w-full md:h-48" />
      <CardContent className="relative px-6 pt-0">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
          <Skeleton className="-mt-12 md:-mt-16 h-24 w-24 rounded-full border-4 border-background md:h-32 md:w-32" />
          <div className="flex flex-1 flex-col gap-1 pt-2 md:pt-0">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
            <div className="mt-2 flex gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
