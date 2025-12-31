"use client";

import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";

export function ProfileView() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
}
