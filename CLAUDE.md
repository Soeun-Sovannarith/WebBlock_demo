@AGENTS.md

# WebBlock Web (platform frontend)

Next.js App Router + TypeScript + Tailwind. Backend is Spring Boot (not built yet):
every screen runs on mock data behind `features/*/api.ts`, ready to swap to the real API.

## Commands
- `npm run dev` — dev server
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run build` — production build
- Package manager is **npm** (commit `package-lock.json`). Never use pnpm or yarn here.
- After each change: `/verify quick` (seconds). Before saying a task is done, committing or pushing: `/verify` (includes the build)

## Map
| Folder | Holds |
|---|---|
| `src/app/` | ROUTES only. Thin `page.tsx`: fetch via a feature, render it |
| `src/features/<name>/` | Business code. Same shape in every feature (see below) |
| `src/components/ui/` | Layer 1 shadcn/ui primitives (button, table, pagination). No business logic |
| `src/components/common/` | Layer 2 design system (DataTable, StatusBadge, Modal, Toast, charts) |
| `src/components/layout/` | Sidebars and app shells |
| `src/lib/` | API client, ApiError, ActionResult, auth session, format, table-query (URL page/sort) |
| `src/mocks/` | Fake data (plain arrays). ONLY `features/*/api.ts` may import it |
| `public/mock/` | Fake images. Referenced as URL strings in mocks |
| `src/config/` | Sidebar nav items, site constants |

Feature shape:
```
features/<name>/
  components/   UI only this feature uses
  actions.ts    "use server" writes: require*() → zod → api → revalidatePath
  api.ts        data access: mock now, Spring later (the ONLY swap point)
  schemas.ts    zod form schemas
  types.ts      one type per entity, same shape as the API (no mappers, no view models)
  index.ts      public exports — import a feature only through this
```

**Reference feature: `src/features/products`.** When building any new feature, copy its patterns.

## Import direction (never reverse)
`app → features → components/common → components/ui → npm packages`
`features → lib` · `features/*/api.ts → mocks`
Never import `sonner`, `recharts`, `@radix-ui/*` or Puck directly: use the wrappers in `components/`.

## Invariants (enforced by `.claude/hooks/invariants.mjs` on every edit and in `/verify`)
1. ZERO-TRANSACTION: no cart, checkout, payment form, booking, or WhatsApp in website/editor code.
   Website CTAs only: `tel:`, `mailto:`, Google Maps directions, external `https://` links.
   Platform subscription billing (KHQR) lives only in `features/billing`, and it only DISPLAYS
   the QR returned by the API — never integrate the payment provider in the frontend.
2. Backend owns logic: retries, deploy state machine, OTP, SSL, payment. Frontend triggers and displays.
3. Every Server Action starts with the right check: `requireAdmin()` in features/admin,
   `requireWebsiteOwner(websiteId)` when it acts on a website, otherwise `requireUser()`.
4. Mock data uses the API DTO shape (camelCase, UUID string ids, price as string, ISO-8601 UTC dates).

## Conventions
- Server Components by default. `"use client"` only on leaves: forms, modals, toggles, menus.
- Reads in Server Components via `api.ts`. Writes via Server Actions. Never fetch data in actions.
- Filters, tabs, search, pagination live in URL `searchParams`.
- Mock functions: async, short delay, return `Page<T>` for lists, throw `ApiError` on failure.
- Every list screen has loading, empty and error states.
- Format at render with `lib/format.ts` (USD/KHR, dates, 12-hour time).
- Named exports. kebab-case file names. No `any`.
- Reuse a `components/common` component before creating a new one.

## Design (from Figma)
Headings Familjen Grotesk, body DM Sans. White background, one accent `#4379D6`,
neutral borders `#E5E7EB`. Page titles in `#4379D6`. Tokens live in `src/app/globals.css`
`@theme` — never hardcode hex values in components. Product images are 4:3.
UI library: **shadcn/ui only** (no Mantine/MUI). Icons: **`iconsax-reactjs`** only.
Details and component usage: `.claude/rules/components.md`.

## Workflow
- New feature: `/new-feature <name>` · Figma screen → code: `/figma-to-screen <figma-url>`
- Bugs: `/investigate` — no fix without a reproduction first.
- Review before committing: ask the `code-reviewer` and `invariant-auditor` agents.
- CI (`.github/workflows/ci.yml`) runs the invariant checks, their tests, lint, build and gitleaks
  on pushes to `dev`/`master` and pull requests into them.
- Branches: work on your own branch (any short, clear name, e.g. `products-page`) → pull request into `dev`.
  Only the designated teammate merges `dev` into `master` for submission. Never commit to `master` yourself.
- Never edit `.claude/hooks/` to make a check pass; if a rule looks wrong, stop and ask.
