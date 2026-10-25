---
paths:
  - "src/features/**/actions.ts"
  - "src/lib/actions/**"
---

# Server Action rules

Every action is a public POST endpoint. Write it in this order, every time:

1. `"use server"` at the top of the file.
2. Auth as the FIRST statement, using the right check (from `@/lib/auth/session`):
   | Action | First statement |
   |---|---|
   | In `features/admin/**` | `await requireAdmin()` |
   | Has a `websiteId` parameter (acts on one website) | `await requireWebsiteOwner(websiteId)` — that exact parameter, never another id |
   | Anything else (own profile, own account) | `await requireUser()` |
   Make `websiteId` a direct parameter whenever an action acts on a website. The checker treats ANY action
   that mentions `websiteId` (param, nested object, alias, `formData.get("websiteId")`) as website-scoped.
   Never trust ids from the client; re-check ownership even if the page did.
   Spring Boot must also check that child ids (productId, orderId) belong to that website.
3. Validate with the feature's zod schema (`safeParse`). On failure return
   `{ ok: false, message, fieldErrors: z.flattenError(error).fieldErrors, values }`.
4. Call the feature's `api.ts` only. No mocks, no fetch here.
5. `revalidatePath(...)` for EVERY page that shows the changed data.
6. Return `ActionResult<T>` from `@/lib/actions/result`. Expected failures are returned, not thrown.
   Catch `ApiError` and return its message; let unknown errors throw to `error.tsx`.

- Actions are for writes only. Never read/list data in an action.
- Form actions use the signature `(boundArgs..., prev: ActionResult | null, formData: FormData)`
  so they work with `useActionState`. Bind ids with `.bind(null, websiteId)`.
- Echo submitted values back in `values` so the form keeps the user's input after a validation error.
- Deploy/redeploy actions send an idempotency key; the backend owns retries — never retry in the frontend.

```ts
"use server";
export async function createProductAction(
  websiteId: string,
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireWebsiteOwner(websiteId);
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = productInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.",
             fieldErrors: z.flattenError(parsed.error).fieldErrors, values: raw };
  }
  try {
    const product = await createProduct(websiteId, parsed.data);
    revalidatePath(`/portal/${websiteId}/products`);
    return { ok: true, data: { id: product.id }, message: "Product added" };
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message, values: raw };
    throw e;
  }
}
```
