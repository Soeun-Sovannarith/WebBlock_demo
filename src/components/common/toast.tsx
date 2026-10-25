"use client";

// The only place that imports sonner. Use `toast.success / warning / error` everywhere else.
import { Toaster as SonnerToaster, toast as sonner } from "sonner";
import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "error";

const variants = {
  success: { bar: "bg-success", title: "text-success" },
  warning: { bar: "bg-warning", title: "text-warning" },
  error: { bar: "bg-danger", title: "text-danger" },
} satisfies Record<Variant, { bar: string; title: string }>;

function show(variant: Variant, title: string, message?: string) {
  const styles = variants[variant];
  return sonner.custom((id) => (
    <div
      role={variant === "error" ? "alert" : "status"}
      className="flex w-[356px] animate-toast-in overflow-hidden rounded-lg border border-border bg-background shadow-sm"
    >
      <span aria-hidden className={cn("w-1 shrink-0", styles.bar)} />
      <div className="flex-1 px-4 py-3">
        <p className={cn("text-sm font-semibold", styles.title)}>{title}</p>
        {message && <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>}
      </div>
      <button
        type="button"
        aria-label="Close notification"
        onClick={() => sonner.dismiss(id)}
        className="px-3 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
      >
        ✕
      </button>
    </div>
  ));
}

export const toast = {
  success: (title: string, message?: string) => show("success", title, message),
  warning: (title: string, message?: string) => show("warning", title, message),
  error: (title: string, message?: string) => show("error", title, message),
};

/** Mounted once in the root layout. */
export function Toaster() {
  return <SonnerToaster position="top-right" />;
}
