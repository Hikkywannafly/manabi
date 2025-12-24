import { DashboardPage } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { DeleteAccountCard } from "@/features/account/components/delete-account-card";
import { ProfileBannerCard } from "@/features/account/components/profile-banner-card";
import { ProfileNameCard } from "@/features/account/components/profile-name-card";
import { ProfilePictureCard } from "@/features/account/components/profile-picture-card";
import { ProfilePrivacyCard } from "@/features/account/components/profile-privacy-card";

export default function AccountPage() {
  return (
    <DashboardPage
      title="Account Settings"
      description="Manage account and website settings."
    >
      <div className="grid gap-6">
        <ProfilePictureCard />
        <ProfileBannerCard />
        <ProfileNameCard />
        <ProfilePrivacyCard />
        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Save All Changes
          </Button>
        </div>
        <DeleteAccountCard />
      </div>
    </DashboardPage>
  );
}
