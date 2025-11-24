"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeleteAccountCard() {
  return (
    <Card className="border-red-100 bg-red-50/50">
      <CardHeader>
        <CardTitle className="text-red-600">Delete Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="destructive">Delete Account</Button>
      </CardContent>
    </Card>
  );
}
