"use client";

import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
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
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();

  // Local state for form fields
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateAccount(formData);
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfilePictureCard />
          <ProfileBannerCard />
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
          onClick={() => setFormData(profile || {})}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          className="gap-2 bg-blue-600 font-semibold hover:bg-blue-700"
          onClick={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save All Changes
        </Button>
      </div>

      <div className="mt-6 border-t pt-10">
        <DeleteAccountCard />
      </div>
    </div>
  );
}
