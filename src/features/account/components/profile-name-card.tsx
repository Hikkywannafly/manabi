"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileDetailsCardProps {
  data?: {
    nickname: string;
    full_name: string;
    bio: string;
  };
  onChange?: (field: string, value: string) => void;
}

export function ProfileDetailsCard({
  data,
  onChange,
}: ProfileDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            placeholder="Your nickname"
            defaultValue={data?.nickname}
            onChange={(e) => onChange?.("nickname", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            placeholder="Your full name"
            defaultValue={data?.full_name}
            onChange={(e) => onChange?.("full_name", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            className="min-h-[100px]"
            defaultValue={data?.bio}
            onChange={(e) => onChange?.("bio", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
