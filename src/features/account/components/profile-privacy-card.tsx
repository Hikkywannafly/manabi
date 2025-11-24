"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function ProfilePrivacyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Privacy</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="font-medium text-sm">Public</span>
        <Switch defaultChecked />
      </CardContent>
    </Card>
  );
}
