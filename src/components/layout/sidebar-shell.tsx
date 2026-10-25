import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

/** Shared frame for the three sidebars: brand on top, nav below. */
export function SidebarShell({
  label,
  homeHref,
  children,
}: {
  label?: string;
  homeHref: string;
  children: ReactNode;
}) {
  return (
    <aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col gap-6 border-r border-border bg-background px-3 py-5">
      <Link href={homeHref} className="px-3">
        <span className="font-heading text-xl font-semibold text-primary">
          {siteConfig.name}
        </span>
        {label && <span className="block text-xs text-muted-foreground">{label}</span>}
      </Link>
      {children}
    </aside>
  );
}
