---
paths:
  - "src/features/**"
  - "src/mocks/**"
---

# Feature rules

Every feature has exactly this shape. Copy `src/features/products` when unsure.

```
features/<name>/
  components/   UI only this feature uses
  actions.ts    Server Actions (writes)
  api.ts        data access — the ONLY file that touches mocks or the HTTP client
  schemas.ts    zod schemas
  types.ts      entity types = API DTO shape
  index.ts      public exports
```

## api.ts (the swap point)
- Function signatures must match the future Spring endpoint: same params (pass `websiteId` even if the
  mock ignores it), same return type, same errors.
- Mock implementation rules:
  - `async`, with a short delay (200–400 ms) so loading states are visible.
  - Lists return `Page<T>` from `@/lib/api/types` (`{ items, page, size, totalItems }`), never a bare array.
  - Not found / failure → `throw new ApiError({ title, status, detail })` from `@/lib/api/errors`.
  - Writes mutate the in-memory mock array (resets on server restart — that's fine).
- No mappers, no view models, no silent fallbacks for missing fields. Return data as-is.
- When Spring is ready, only the function bodies change (openapi-fetch call). Nothing else.

## types.ts
- One type per entity, same shape as the API JSON: camelCase, `id: string` (UUID),
  `price: string` (decimal), dates as ISO-8601 UTC `string`, nullable fields as `T | null`.
- Status enums are UPPER_SNAKE string unions, e.g. `"LIVE" | "DEPLOYING" | "DRAFT" | "FAILED"`.

## mocks
- `src/mocks/<entity>.ts` exports typed arrays (`Product[]`), importing types from the feature.
- Images are URL strings to `public/mock/...` (`"/mock/products/iced-latte.webp"`), never `import img`.
- Include edge cases: `imageUrl: null`, very long names, KHR prices, empty lists.

## index.ts
- Export only what pages need: view components, api read functions, types.
- Other features import through `@/features/<name>`; inside a feature use relative imports.

## Components
- Server Components by default; `"use client"` only for interactive leaves.
- A component used by a second feature moves to `src/components/common/`.
