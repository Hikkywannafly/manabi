"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileBannerCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    "/placeholder-banner.jpg",
  );

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Banner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-full overflow-hidden rounded-md border bg-muted">
          <Image
            src={previewUrl}
            alt="Profile banner"
            fill
            className="object-cover"
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleBannerChange}
        />
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
          Choose Banner
        </Button>
      </CardContent>
    </Card>
  );
}
