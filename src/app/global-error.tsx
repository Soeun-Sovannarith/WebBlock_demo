"use client";

import { ErrorState } from "@/components/common/error-state";
import "./globals.css";

// Replaces the root layout when it fails, so it renders its own <html> and <body>.
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center p-page">
        <ErrorState error={error} retry={retry} />
      </body>
    </html>
  );
}
