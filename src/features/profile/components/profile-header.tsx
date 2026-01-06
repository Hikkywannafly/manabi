"use client";

import { format } from "date-fns";
import { ArrowLeft, Camera, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "../hooks";

export function ProfileHeader() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const router = useRouter();

  if (isProfileLoading) {
    return <ProfileHeaderSkeleton />;
  }

  const joinDate = profile?.created_at
    ? format(new Date(profile.created_at), "MMMM yyyy")
    : "N/A";

  const displayName = profile?.full_name || profile?.nickname || "User";
  const level = profile?.level || 1;
  const xp = profile?.total_xp || 0;
  const streak = profile?.current_streak || 0;

  return (
    <div className="relative">
      {/* Banner Section */}
      <div className="relative z-10 h-48 w-full overflow-hidden md:h-64">
        <div className="group relative z-20 mx-auto h-full max-w-6xl">
          {profile?.banner_url ? (
            <Image
              src={profile.banner_url}
              alt="Profile banner"
              fill
              className="relative z-10 size-full object-cover opacity-85"
              priority
            />
          ) : (
            <div className="relative z-10 size-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-85" />
          )}

          <label
            htmlFor="banner-upload"
            className="absolute inset-0 z-30 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100"
          >
            <div className="inline-flex items-center justify-center gap-2 rounded-md bg-white/90 px-4 py-2 font-medium text-gray-900 text-sm shadow-lg transition-all hover:scale-105 hover:bg-white">
              <Camera className="size-4" />
              Change Banner
            </div>
            <input
              id="banner-upload"
              accept="image/*"
              className="hidden"
              type="file"
            />
          </label>
        </div>

        {/* Back Button */}
        <div className="pointer-events-none absolute inset-0 z-40">
          <div className="mx-auto h-full max-w-6xl px-4 md:px-6">
            <div className="relative h-full">
              <div className="pointer-events-auto absolute top-4 left-0 z-20">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-2xl bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(13, 83, 109, 0.7) 0%,
            rgba(13, 83, 109, 0.65) 10%,
            rgba(13, 83, 109, 0.55) 20%,
            rgba(13, 83, 109, 0.50) 30%,
            rgba(13, 83, 109, 0.45) 40%,
            rgba(13, 83, 109, 0.40) 50%,
            rgba(13, 83, 109, 0.30) 60%,
            rgba(13, 83, 109, 0.20) 70%,
            rgba(13, 83, 109, 0.10) 80%,
            rgba(13, 83, 109, 0.05) 90%,
            hsl(var(--background)) 100%
          )`,
        }}
      />

      {/* Profile Info Section */}
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl rounded-b-lg bg-secondary/50 px-4 backdrop-blur-md md:px-6">
          <div className="relative">
            {/* Avatar */}
            <div className="-top-16 absolute z-50 rounded-full bg-secondary p-1">
              <div className="group relative">
                <div className="relative flex size-32 shrink-0 overflow-hidden rounded-full ring-1 ring-background">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={displayName}
                      fill
                      className="aspect-square size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/10 font-bold text-2xl text-primary">
                      {displayName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100"
                >
                  <div className="flex flex-col items-center justify-center gap-1 text-white">
                    <Camera className="size-8" />
                    <span className="font-medium text-xs">Change</span>
                  </div>
                  <input
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    type="file"
                  />
                </label>
              </div>
            </div>

            {/* User Details */}
            <div className="pt-20 pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-2xl md:text-3xl">
                      {displayName}
                    </h1>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Badge
                      variant="default"
                      className="bg-primary hover:bg-primary/80"
                    >
                      Level {level}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {xp.toLocaleString()} XP
                    </span>
                    <span className="text-muted-foreground text-sm">
                      🔥 {streak} days streak
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground text-sm">
                    <span>Joined {joinDate}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />3 views
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/account")}
                    className="rounded-xl"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="h-48 w-full md:h-64" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative">
          <Skeleton className="-top-16 absolute h-32 w-32 rounded-full border-4 border-background" />
          <div className="pt-20 pb-4">
            <div className="space-y-4">
              <Skeleton className="h-10 w-48" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
