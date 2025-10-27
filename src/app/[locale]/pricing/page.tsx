import { Nav } from "@/components/hero/nav";
import { Plans } from "@/components/pricing/plans";
import { RadialBlur } from "@/components/pricing/radial-blur";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Paddle Web Payments Starter",
  description: "Unlock Scam Protection, VPN, and more",
};

export default function Pricing() {
  return (
    <div className="isolate flex h-full min-h-screen w-full flex-col bg-card p-8">
      <RadialBlur />
      <Nav />
      <Plans />
    </div>
  );
}
