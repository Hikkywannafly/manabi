"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProfilePrivacyCardProps {
  data?: {
    is_public: boolean;
    allow_messages: boolean;
    show_email: boolean;
  };
  onChange?: (field: string, value: boolean) => void;
}

export function ProfilePrivacyCard({
  data,
  onChange,
}: ProfilePrivacyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="public-profile">Public Profile</Label>
            <p className="text-muted-foreground text-xs">
              Allow others to see your profile and stats.
            </p>
          </div>
          <Switch
            id="public-profile"
            checked={data?.is_public}
            onCheckedChange={(checked) => onChange?.("is_public", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="messages">Allow Messages</Label>
            <p className="text-muted-foreground text-xs">
              Receive messages from other learners.
            </p>
          </div>
          <Switch
            id="messages"
            checked={data?.allow_messages}
            onCheckedChange={(checked) => onChange?.("allow_messages", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-email">Show Email</Label>
            <p className="text-muted-foreground text-xs">
              Display your email address on your public profile.
            </p>
          </div>
          <Switch
            id="show-email"
            checked={data?.show_email}
            onCheckedChange={(checked) => onChange?.("show_email", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
