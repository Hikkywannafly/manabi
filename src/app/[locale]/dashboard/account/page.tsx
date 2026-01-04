import { DashboardPage } from "@/components/layouts";
import { AccountView } from "@/features/account/components";

export default function AccountPage() {
  return (
    <DashboardPage
      title="Account Settings"
      description="Manage account and website settings."
    >
      <AccountView />
    </DashboardPage>
  );
}
