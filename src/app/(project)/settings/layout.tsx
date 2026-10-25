import type { ReactNode } from "react";
import { SegmentedTabs } from "@/components/common/segmented-tabs";

const tabs = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Billing", href: "/settings/billing" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SegmentedTabs tabs={tabs} />
      {children}
    </>
  );
}
