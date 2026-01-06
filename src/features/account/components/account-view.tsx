"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateAccount } from "@/features/account/hooks";
import { useProfile } from "@/features/profile/hooks";
import type { Profile } from "@/types/db/profile";
import { DeleteAccountCard } from "./delete-account-card";
import { ProfileBannerCard } from "./profile-banner-card";
import { ProfileDetailsCard } from "./profile-name-card";
import { ProfilePictureCard } from "./profile-picture-card";
import { ProfilePrivacyCard } from "./profile-privacy-card";
import { ProfileSocialCard } from "./profile-social-card";

export function AccountView() {
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();

  // Local state for form fields
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Navigation guard state
  const [showNavDialog, setShowNavDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setIsDirty(false);
    }
  }, [profile]);

  // Track if content has changed
  useEffect(() => {
    if (!profile) return;

    // Simple comparison to check for changes
    const hasChanged =
      formData.nickname !== profile.nickname ||
      formData.full_name !== profile.full_name ||
      formData.bio !== profile.bio ||
      formData.avatar_url !== profile.avatar_url ||
      formData.banner_url !== profile.banner_url ||
      formData.is_public !== profile.is_public ||
      formData.allow_messages !== profile.allow_messages ||
      formData.show_email !== profile.show_email ||
      formData.website_url !== profile.website_url ||
      formData.github_url !== profile.github_url ||
      formData.twitter_url !== profile.twitter_url ||
      formData.linkedin_url !== profile.linkedin_url;

    setIsDirty(hasChanged);
  }, [formData, profile]);

  // Browser-level navigation guard (Refresh, Close Tab)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Internal navigation guard (Sidebar, Header links)
  useEffect(() => {
    const handleInternalNavigation = (e: MouseEvent) => {
      if (!isDirty) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link?.href && link.target !== "_blank") {
        const url = new URL(link.href);
        // Only guard if it's internal navigation and different from current path
        if (url.origin === window.location.origin) {
          if (url.pathname !== window.location.pathname) {
            e.preventDefault();
            setPendingUrl(link.href);
            setShowNavDialog(true);
          }
        }
      }
    };

    document.addEventListener("click", handleInternalNavigation, true);
    return () =>
      document.removeEventListener("click", handleInternalNavigation, true);
  }, [isDirty]);

  const confirmNavigation = () => {
    if (pendingUrl) {
      setIsDirty(false); // Reset dirty state to allow navigation
      router.push(pendingUrl);
    }
    setShowNavDialog(false);
  };

  const cancelNavigation = () => {
    setPendingUrl(null);
    setShowNavDialog(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateAccount(formData, {
      onSuccess: () => {
        setIsDirty(false);
        setPendingUrl(null);
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 pb-20">
      {/* Shadcn Navigation Alert Dialog */}
      <AlertDialog open={showNavDialog} onOpenChange={setShowNavDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes on your profile. Are you sure you want to
              leave? Your changes will be lost if you don't save them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>
              Stay on Page
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmNavigation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfilePictureCard
            currentUrl={formData.avatar_url}
            onChange={(url) => handleFieldChange("avatar_url", url)}
          />
          <ProfileBannerCard
            currentUrl={formData.banner_url}
            onChange={(url) => handleFieldChange("banner_url", url)}
          />
        </div>
        <div className="space-y-6">
          <ProfileDetailsCard
            data={formData as any}
            onChange={handleFieldChange}
          />
          <ProfilePrivacyCard
            data={formData as any}
            onChange={handleFieldChange}
          />
        </div>
      </div>

      <ProfileSocialCard data={formData as any} onChange={handleFieldChange} />

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isDirty && !window.confirm("Discard unsaved changes?")) return;
            setFormData(profile || {});
            setIsDirty(false);
          }}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          className="gap-2 bg-blue-600 font-semibold hover:bg-blue-700"
          onClick={handleSave}
          disabled={isUpdating || !isDirty}
        >
          {isUpdating ? (
            <Loader2 key="save-loader" className="h-4 w-4 animate-spin" />
          ) : (
            <Save key="save-icon" className="h-4 w-4" />
          )}
          <span>Save All Changes</span>
        </Button>
      </div>

      <div className="mt-6 border-t pt-10">
        <DeleteAccountCard />
      </div>
    </div>
  );
}
