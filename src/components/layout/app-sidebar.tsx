import { userNav } from "@/config/nav";
import { SidebarNav } from "./sidebar-nav";
import { SidebarShell } from "./sidebar-shell";

export function AppSidebar() {
  return (
    <SidebarShell homeHref="/websites">
      <SidebarNav items={userNav} />
    </SidebarShell>
  );
}
