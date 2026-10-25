import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-page">{children}</main>
    </div>
  );
}
