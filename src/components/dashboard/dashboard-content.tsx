"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/api/auth/actions";
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
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

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
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">User ID:</span>
              <span className="font-mono text-muted-foreground text-xs">
                {user.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Provider:</span>
              <span className="text-muted-foreground text-sm">
                {user.app_metadata?.provider || "email"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Last Sign In:</span>
              <span className="text-muted-foreground text-sm">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
