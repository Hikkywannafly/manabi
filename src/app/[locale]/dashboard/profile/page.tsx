import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ProfileTabs } from "@/features/profile/components/profile-tabs";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-20">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
}
