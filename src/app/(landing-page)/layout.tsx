import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-border px-page py-4">
        <Link href="/" className="font-heading text-xl font-semibold text-primary">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-page">{children}</main>
    </div>
  );
}
