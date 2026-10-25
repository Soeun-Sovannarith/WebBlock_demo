"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type SegmentedTab = { label: string; href: string };

/** Pill segmented tabs. Each tab is a link, so the active tab lives in the URL. */
export function SegmentedTabs({ tabs }: { tabs: SegmentedTab[] }) {
  const pathname = usePathname();

  return (
    <nav className="mb-6 inline-flex rounded-full border border-border bg-surface p-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
