"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, item: NavItem) {
  if (pathname === item.href) return true;
  return !item.exact && pathname.startsWith(`${item.href}/`);
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:bg-surface hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
