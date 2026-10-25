---
paths:
  - "src/components/**"
  - "src/app/globals.css"
  - "src/features/**/components/**"
---

# Component & design-system rules

## Layers (import direction only goes down)
- `components/ui/` — primitives (button, dialog, input, select, switch, table). Generic, unbranded,
  no data fetching, never imports `common/` or `features/`.
- `components/common/` — the WebBlock design system built from `ui/` and wrapped libraries.
- `components/layout/` — sidebars and shells.
- Feature-only UI stays in `features/<name>/components/`.

## Reuse before creating
Check `components/common/` first. Never create a second badge, modal, table, toast or tab style.
- Every status → `StatusBadge` (pill, light tint, icon per status, normal case, no border).
  Its status map uses `satisfies Record<Status, StatusMeta>` so a new status fails the build.
- Every button → `Button` from `ui/button` (Figma "Button" + "Icon button"). Variants: `primary`
  (one per view), `secondary`, `soft` (Edit, Use template), `ghost`, `dark`, `danger`, `white`.
  Sizes `sm | md | lg` and `icon-sm | icon | icon-lg`. Hover/press motion, `loading` and focus ring are
  built in — don't restyle them. Links that look like buttons: `<Button asChild><Link …/></Button>`.
- Every table → `DataTable` from `common/data-table` ("Draft table style": "No." first column, sortable
  headers, pinned footer "Showing …" + pagination + "Go to", full grid even with few rows).
  It is a Server Component: pass the page's `searchParams`; page/size/sort live in the URL and
  `parseTableQuery()` from `lib/table-query` turns them into the query for `api.ts`.
  Mock `api.ts` builds its `Page<T>` with `toPage()`. Loading state: `DataTableSkeleton`.
- Every modal → `Modal` (Plan-details-dialog style). Row details in Admin open as centered popups.
- Every toast → `toast.success / warning / error` from `common/toast` (white card, coloured left bar,
  coloured title, message, close ✕, slides in from the right). Use toasts only when needed.
- Tabs → `SegmentedTabs` (pill segmented style). Charts → `common/charts` (wraps recharts).
- Images → `ProductImage` (4:3, handles `null`).

## Tokens (defined once in `src/app/globals.css` `@theme`)
- Fonts: Familjen Grotesk (headings), DM Sans (body), loaded with `next/font/google`.
- Background white; accent `#4379D6` (`text-primary`, `bg-primary`); neutral border `#E5E7EB` (`border-border`).
- Page titles use the accent colour. Filled brand surfaces (primary button, active page) use `bg-brand`.
- Token names follow shadcn/ui: text `text-foreground` / `text-foreground-soft` / `text-muted-foreground`
  (secondary text — NOT `text-muted`, which is a background), fills `bg-muted`, `bg-primary-soft`,
  `bg-brand-soft`, `bg-danger-soft`, `bg-success-soft`; shadows `shadow-button`, `shadow-card`.
- Never hardcode hex values or arbitrary colours in components — use tokens.
- No count badges in sidebars. Clean, white, one accent: no gradients, glows or decorative clutter.

## Wrappers
Only `components/` may import `sonner`, `recharts`, `@radix-ui/*`. Puck only in `features/editor`.

## shadcn/ui and icons
- New primitives: `npx shadcn@latest add <name>` (config in `components.json`) → lands in `components/ui/`.
  Then replace its `lucide-react` imports with `iconsax-reactjs` and remove lucide if it was added,
  and swap any colours that don't exist in our tokens.
- Icons: `iconsax-reactjs` only (NOT `iconsax-react`, which breaks on React 19), Linear variant
  (the default). Size icons with classes (`size-4`) or the Button size; colour follows `currentColor`.

## Accessibility
Every interactive element is keyboard reachable; icon-only buttons have `aria-label`;
form fields have labels and `aria-invalid` with the error text.
