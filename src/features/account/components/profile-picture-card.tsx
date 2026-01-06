"use client";

import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/features/profile/hooks";
import { useUploadAvatar } from "../hooks";

interface ProfilePictureCardProps {
  currentUrl?: string | null;
  onChange: (url: string) => void;
}

export function ProfilePictureCard({
  currentUrl,
  onChange,
}: ProfilePictureCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profile } = useProfile();
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file, {
        onSuccess: (url) => {
          onChange(url);
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-muted">
          {currentUrl ? (
            <Image
              src={currentUrl}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 font-bold text-primary text-xl">
              {profile?.nickname?.substring(0, 2).toUpperCase() || "U"}
            </div>
          )}
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isPending}
        />
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 key="picture-loader" className="h-4 w-4 animate-spin" />
          ) : (
            <Camera key="picture-camera" className="h-4 w-4" />
          )}
          <span>Change Photo</span>
        </Button>
      </CardContent>
    </Card>
  );
}
