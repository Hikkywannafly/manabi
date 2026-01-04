import { DashboardPage } from "@/components/layouts";
import { ProfileView } from "@/features/profile/components";

export default function ProfilePage() {
  return (
    <DashboardPage title="Profile">
      <ProfileView />
    </DashboardPage>
  );
}
