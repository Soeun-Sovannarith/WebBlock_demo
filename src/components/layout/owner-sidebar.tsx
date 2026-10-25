import Link from "next/link";
import { ownerNav } from "@/config/nav";
import { SidebarNav } from "./sidebar-nav";
import { SidebarShell } from "./sidebar-shell";

export function OwnerSidebar({ websiteId }: { websiteId: string }) {
  return (
    <SidebarShell label="Owner Portal" homeHref={`/portal/${websiteId}`}>
      <SidebarNav items={ownerNav(websiteId)} />
      <Link
        href="/websites"
        className="mt-auto px-3 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to my websites
      </Link>
    </SidebarShell>
  );
}
