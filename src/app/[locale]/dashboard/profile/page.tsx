import { DashboardPage } from "@/components/layouts";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ProfileTabs } from "@/features/profile/components/profile-tabs";

export default function ProfilePage() {
  return (
    <DashboardPage title="Profile">
      <div className="flex flex-col gap-6">
        <ProfileHeader />
        <ProfileTabs />
      </div>
    </DashboardPage>
  );
}
