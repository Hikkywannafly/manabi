"use client";

import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadBanner } from "../hooks";

interface ProfileBannerCardProps {
  currentUrl?: string | null;
  onChange: (url: string) => void;
}

export function ProfileBannerCard({
  currentUrl,
  onChange,
}: ProfileBannerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadBanner, isPending } = useUploadBanner();

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadBanner(file, {
        onSuccess: (url) => {
          onChange(url);
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Banner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
          {currentUrl ? (
            <Image
              src={currentUrl}
              alt="Profile banner"
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-primary/20 to-accent/20" />
          )}
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleBannerChange}
          disabled={isPending}
        />
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 key="banner-loader" className="h-4 w-4 animate-spin" />
          ) : (
            <Camera key="banner-camera" className="h-4 w-4" />
          )}
          <span>Choose Banner</span>
        </Button>
      </CardContent>
    </Card>
  );
}
