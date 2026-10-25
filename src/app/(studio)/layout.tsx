import type { ReactNode } from "react";

/** Full-screen editor, preview and deploy. No sidebar. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return <main className="flex min-h-dvh flex-col p-page">{children}</main>;
}
