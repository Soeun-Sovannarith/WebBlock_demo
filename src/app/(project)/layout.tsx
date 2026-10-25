import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-page">{children}</main>
    </div>
  );
}
