import { adminNav } from "@/config/nav";
import { SidebarNav } from "./sidebar-nav";
import { SidebarShell } from "./sidebar-shell";

export function AdminSidebar() {
  return (
    <SidebarShell label="Admin Portal" homeHref="/admin">
      <SidebarNav items={adminNav} />
    </SidebarShell>
  );
}
