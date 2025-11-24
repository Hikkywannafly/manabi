"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProfileNameCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Your Name" defaultValue="Đoàn Hùng Quân" />
      </CardContent>
    </Card>
  );
}
