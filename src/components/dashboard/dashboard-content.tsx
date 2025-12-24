"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/api/auth/actions";
import { DashboardPage } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";

export function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DashboardPage
      title="Dashboard"
      description="Welcome back!"
      headerAction={
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Email:</span>
              <span className="text-muted-foreground text-sm">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">User ID:</span>
              <span className="font-mono text-muted-foreground text-xs">
                {user?.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Provider:</span>
              <span className="text-muted-foreground text-sm">
                {user?.app_metadata?.provider || "email"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Last Sign In:</span>
              <span className="text-muted-foreground text-sm">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
