import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface p-page">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8">
        {children}
      </div>
    </main>
  );
}
