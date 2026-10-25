// Regression tests for invariants.mjs. Run from the project root:
//   node --test .claude/hooks/
// Add a case here whenever you change a rule (one blocked example + one allowed example).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkText, checkServerActions, loadTypeScript, toRel } from "./invariants.mjs";

// Fake credentials are assembled at runtime from fragments, so no complete token ever appears in this
// file. That keeps secret scanners (gitleaks in CI) from flagging the test fixtures themselves.
// Keep it that way when adding cases: never write a full fake key as one string literal.
const fake = (...parts) => parts.join("");
const FAKE_GOOGLE_KEY = fake("AIza", "SyA1b2C3d4E5f6G7h8", "I9j0kLmNoPqRsTuVw");
const FAKE_GITHUB_TOKEN = fake("gh", "p_", "abcdefghijklmnopqr", "stuvwxyz0123456789");

const SCRIPT = fileURLToPath(new URL("./invariants.mjs", import.meta.url));
const ids = (rel, text) => checkText(rel, text).map((v) => v.id);

// ── Must be BLOCKED ──────────────────────────────────────────────────────────
const BLOCKED = [
  ["src/features/editor/puck/blocks/hero.tsx", "<button>Buy now</button>", "zero-transaction/order-wording"],
  ["src/features/editor/puck/blocks/hero.tsx", "<button>Order now</button>", "zero-transaction/order-wording"],
  ["src/features/editor/puck/blocks/hero.tsx", "<h2>Booking</h2>", "zero-transaction/booking"],
  ["src/features/editor/puck/blocks/hero.tsx", "<a>Book now</a>", "zero-transaction/booking"],
  ["src/features/products/components/q.tsx", "<QuantitySelector />", "zero-transaction/quantity"],
  ["src/features/products/components/q.tsx", "const qty = 1;", "zero-transaction/quantity"],
  ["src/features/editor/puck/blocks/cards.tsx", "onClick={addToCart}", "zero-transaction/cart"],
  ["src/features/editor/puck/blocks/cards.tsx", "const { items } = useCart();", "zero-transaction/cart"],
  ["src/features/editor/puck/blocks/cards.tsx", "<Cart open />", "zero-transaction/cart"],
  ["src/features/editor/puck/blocks/cards.tsx", "<CheckoutButton />", "zero-transaction/checkout"],
  ["src/components/common/cta.tsx", '<a href="https://wa.me/855">x</a>', "zero-transaction/whatsapp"],
  ["src/components/common/cta.tsx", "Chat on WhatsApp", "zero-transaction/whatsapp"],
  // Billing is NOT exempt any more (the review's "too broad exception" finding)
  ["src/features/billing/api.ts", 'import Stripe from "stripe";', "zero-transaction/payment-provider"],
  ["src/features/billing/components/pay.tsx", '<a href="https://wa.me/1">help</a>', "zero-transaction/whatsapp"],
  ["src/features/billing/components/pay.tsx", "<CheckoutSummary />", "zero-transaction/checkout"],
  ["src/features/billing/api.ts", 'fetch("https://api.webill365.com/v1/qr")', "zero-transaction/payment-provider"],
  // Boundaries
  ["src/features/products/components/grid.tsx", 'import { mockProducts } from "@/mocks/products";', "boundary/mocks"],
  ["src/features/products/components/grid.tsx", 'import { mockProducts } from "../../../mocks/products";', "boundary/mocks"],
  ["src/app/admin/page.tsx", 'import { mockUsers } from "@/mocks/users";', "boundary/mocks"],
  ["src/features/products/components/form.tsx", 'import { toast } from "sonner";', "boundary/wrapped-library"],
  ["src/features/site-monitor/components/c.tsx", 'const C = dynamic(() => import("recharts"));', "boundary/wrapped-library"],
  ["src/features/admin/users/components/m.tsx", 'import * as Dialog from "@radix-ui/react-dialog";', "boundary/wrapped-library"],
  ["src/components/common/editor.tsx", 'import { Puck } from "@measured/puck";', "boundary/puck"],
  // Secrets
  ["src/lib/auth/session.ts", "process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET", "secret/public-env"],
  ["src/lib/api/client.ts", fake('const client_', 'secret = "', 'abc123', 'xyz";'), "secret/hardcoded"],
];

for (const [rel, text, id] of BLOCKED) {
  test(`blocks ${id}: ${text.slice(0, 40)}`, () => assert.ok(ids(rel, text).includes(id), `expected ${id} in ${rel}`));
}

// ── Must be ALLOWED ──────────────────────────────────────────────────────────
const ALLOWED = [
  ["src/components/common/cta.tsx", '<a href="tel:+85512345678">Call us</a>'],
  ["src/components/common/cta.tsx", '<a href="mailto:hi@shop.com">Email us</a>'],
  ["src/components/common/cta.tsx", '`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a)}`'],
  ["src/components/common/cta.tsx", "<button>Contact us</button>"],
  ["src/features/billing/components/pay.tsx", "<button>Pay now</button> {order.orderId} KHQR expires in 10:00"],
  ["src/features/billing/api.ts", "export async function getOrder(orderId: string) {}"],
  ["src/app/(landing-page)/page.tsx", "<p>Check out our templates</p>"],
  ["src/components/ui/table.tsx", 'className="striped rows"'],
  ["src/components/common/social.tsx", "facebook.com/petalandstem"],
  ["src/features/products/api.ts", 'import { mockProducts } from "@/mocks/products";'],
  ["src/features/admin/users/api.ts", 'import { mockUsers } from "@/mocks/users";'],
  ["src/lib/auth/session.ts", 'import { mockUsers } from "@/mocks/session";'],
  ["src/mocks/products.ts", 'import type { Product } from "@/features/products/types";'],
  ["src/components/common/toast.tsx", 'import { Toaster, toast } from "sonner";'],
  ["src/components/common/charts/donut.tsx", 'import { PieChart } from "recharts";'],
  ["src/components/ui/dialog.tsx", 'import * as Dialog from "@radix-ui/react-dialog";'],
  ["src/features/editor/components/shell.tsx", 'import { Puck } from "@measured/puck";'],
  ["src/lib/api/client.ts", "process.env.NEXT_PUBLIC_API_BASE_URL"],
  ["README.md", "add to cart, checkout, WhatsApp"], // outside src/
  [".claude/rules/non-transactional.md", "No cart, checkout or WhatsApp"], // outside src/
];

for (const [rel, text] of ALLOWED) {
  test(`allows ${rel}: ${text.slice(0, 40)}`, () => assert.deepEqual(ids(rel, text), []));
}

// ── Paths: Windows and POSIX ─────────────────────────────────────────────────
test("toRel handles Windows paths", () => {
  assert.equal(
    toRel("C:\\Users\\Zeven\\Desktop\\webblock-web\\src\\features\\x\\api.ts", "C:\\Users\\Zeven\\Desktop\\webblock-web"),
    "src/features/x/api.ts",
  );
  assert.equal(toRel("c:/users/zeven/desktop/webblock-web/src/a.ts", "C:\\Users\\Zeven\\Desktop\\webblock-web"), "src/a.ts");
  assert.equal(toRel("C:\\Users\\Zeven\\Desktop\\webblock-web\\src\\a.ts", undefined), "src/a.ts");
  assert.equal(toRel("/home/me/webblock-web/src/a.ts", "/home/me/webblock-web"), "src/a.ts");
  assert.equal(toRel("D:\\other\\README.md", "C:\\proj"), null);
});

// ── Server Action auth (needs the project's typescript package) ─────────────
const ts = loadTypeScript(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const SKIP = { skip: !ts && "typescript not installed" };
const PRODUCTS = "src/features/products/actions.ts";
const ADMIN = "src/features/admin/users/actions.ts";
/** [actionName, ruleId] for every problem found. */
const problems = (text, rel = PRODUCTS) =>
  checkServerActions(ts, rel, `"use server";\n${text}`).map((v) => [v.match, v.id]);

test("auth: correct checks are accepted", SKIP, () => {
  assert.deepEqual(problems(`
export async function updateProfile(fd: FormData) { const user = await requireUser(); return user; }
export async function createProduct(websiteId: string, _prev: unknown, fd: FormData): Promise<{ ok: boolean }> {
  await requireWebsiteOwner(websiteId); return { ok: true };
}
export const deleteProduct = async (websiteId: string, productId: string) => { await requireWebsiteOwner(websiteId); };
export async function saveInfo({ websiteId, name }: { websiteId: string; name: string }) { await requireWebsiteOwner(websiteId); }
export async function savePage(input: { websiteId: string }) { await requireWebsiteOwner(input.websiteId); }
async function renameSite(websiteId: string) { await requireWebsiteOwner(websiteId); }
export { renameSite as rename };
export type Foo = { a: string };`), []);
});

test("auth: missing or late check is reported", SKIP, () => {
  assert.deepEqual(problems(`
export async function noAuth() { return 1; }
export async function lateAuth(websiteId: string) { const x = websiteId.trim(); await requireWebsiteOwner(x); }
export async function notAwaited() { requireUser(); }
export const arrowExpr = async () => requireAdmin();
async function hidden() { return 2; }
export { hidden };`), [
    ["noAuth", "auth/server-action"], ["lateAuth", "auth/server-action"], ["notAwaited", "auth/server-action"],
    ["arrowExpr", "auth/server-action"], ["hidden", "auth/server-action"],
  ]);
});

test("auth: wrong function for a website action is reported", SKIP, () => {
  assert.deepEqual(problems(`
export async function onlyLoggedIn(websiteId: string, fd: FormData) { await requireUser(); }
export async function adminInstead(websiteId: string) { await requireAdmin(); }`), [
    ["onlyLoggedIn", "auth/website-owner"], ["adminInstead", "auth/website-owner"],
  ]);
});

test("auth: wrong id passed to requireWebsiteOwner is reported", SKIP, () => {
  assert.deepEqual(problems(`
export async function productIdInstead(websiteId: string, productId: string) { await requireWebsiteOwner(productId); }
export async function literalId(websiteId: string) { await requireWebsiteOwner("site-1"); }
export async function noWebsiteParam(siteId: string) { await requireWebsiteOwner(siteId); }
export async function fromOtherObject(input: { siteId: string }) { await requireWebsiteOwner(input.siteId); }`), [
    ["productIdInstead", "auth/website-owner"], ["literalId", "auth/website-owner"],
    ["noWebsiteParam", "auth/website-owner"], ["fromOtherObject", "auth/website-owner"],
  ]);
});

test("auth: admin features must use requireAdmin", SKIP, () => {
  assert.deepEqual(problems(`
export async function suspendUser(userId: string) { const admin = await requireAdmin(); }
export async function suspendHosting(websiteId: string) { await requireAdmin(); }
export async function userCheck(userId: string) { await requireUser(); }
export async function ownerCheck(websiteId: string) { await requireWebsiteOwner(websiteId); }`, ADMIN), [
    ["userCheck", "auth/admin-action"], ["ownerCheck", "auth/admin-action"],
  ]);
});

test("auth: non-'use server' files are ignored", SKIP, () => {
  assert.deepEqual(checkServerActions(ts, PRODUCTS, "export async function listProducts() { return []; }"), []);
});


test("auth: websiteId hidden in nested, aliased or named-type params is still caught", SKIP, () => {
  assert.deepEqual(problems(`
type SaveInput = { websiteId: string; name: string };
export async function nested(input: { websiteId: string }) { await requireUser(); }
export async function aliased({ websiteId: id }: { websiteId: string }) { await requireUser(); }
export async function namedType(input: SaveInput) { await requireUser(); return input.websiteId; }
export async function fromForm(_prev: unknown, fd: FormData) { await requireUser(); const w = fd.get("websiteId"); }
export async function aliasWrongVar({ websiteId: id, productId }: { websiteId: string; productId: string }) {
  await requireWebsiteOwner(productId);
}`), [
    ["nested", "auth/website-owner"], ["aliased", "auth/website-owner"], ["namedType", "auth/website-owner"],
    ["fromForm", "auth/website-owner"], ["aliasWrongVar", "auth/website-owner"],
  ]);
});

test("auth: aliased and named-type website ids are accepted when checked", SKIP, () => {
  assert.deepEqual(problems(`
type SaveInput = { websiteId: string };
export async function aliasedOk({ websiteId: id }: { websiteId: string }) { await requireWebsiteOwner(id); }
export async function namedTypeOk(input: SaveInput) { await requireWebsiteOwner(input.websiteId); }`), []);
});

// ── Comments are ignored by zero-transaction/boundary rules, but not by secret rules ──
const codeIds = (rel, text) => checkText(rel, text, ts).map((v) => v.id);

test("comments: harmless comments are allowed", SKIP, () => {
  assert.deepEqual(codeIds("src/features/editor/puck/blocks/cards.tsx", `
// Zero-transaction: no cart, no checkout, no WhatsApp here.
/* Product cards never show quantity or "Buy now". */
export const Cards = () => <a href="tel:+855">Call us</a>;
// import { toast } from "sonner";`), []);
});

test("comments: real code is still caught (JSX text, strings with //, apostrophes)", SKIP, () => {
  const rel = "src/features/editor/puck/blocks/cards.tsx";
  assert.deepEqual(codeIds(rel, `export const A = () => <p>Don't forget: add to cart</p>;`), ["zero-transaction/cart"]);
  assert.deepEqual(codeIds(rel, `const url = "https://wa.me/855"; // contact`), ["zero-transaction/whatsapp"]);
  assert.deepEqual(codeIds(rel, `const a = 1; /* note */ export const B = () => <button>Buy now</button>;`), ["zero-transaction/order-wording"]);
});

test("comments: secrets inside comments are still caught", SKIP, () => {
  assert.ok(codeIds("src/lib/api/client.ts", `// temp key ${FAKE_GOOGLE_KEY}`).includes("secret/known-token"));
});

// ── Secrets ──────────────────────────────────────────────────────────────────
test("secrets: real-looking credentials are blocked", () => {
  const rel = "src/lib/api/client.ts";
  assert.ok(ids(rel, `const apiKey = "${FAKE_GOOGLE_KEY}";`).includes("secret/known-token"));
  assert.ok(ids(rel, fake('const api', 'Key = "', 'a8f3k29d', 'k3l2m9x0q7";')).includes("secret/assigned-credential"));
  assert.ok(ids(rel, fake('headers: { auth', 'Token: "', 'Zx9Kq2Lm', '8Np4Rt6V" }')).includes("secret/assigned-credential"));
  assert.ok(ids(rel, fake('const admin = { pass', 'word: "', 'SuperSec', 'ret123!" };')).includes("secret/assigned-credential"));
  assert.ok(ids(rel, `const t = "${FAKE_GITHUB_TOKEN}";`).includes("secret/known-token"));
});

test("secrets: ordinary values are allowed", () => {
  const rel = "src/features/auth/components/form.tsx";
  for (const text of [
    'const apiKey = process.env.MAPS_API_KEY;',
    'const forgotPasswordPath = "/forgot-password";',
    fake('const password', 'ResetUrl = "', 'https://webblock.com/', 'reset1";'),
    '<input placeholder="Enter your password" />',
    fake('const password', 'Label = "', 'Password";'),
    fake('const token', 'Key = "', 'wb.session.', 'token";'),
  ]) assert.deepEqual(ids(rel, text), [], text);
  assert.deepEqual(ids("src/mocks/session.ts", fake('pass', 'word: "', 'DemoPass', '2026!"')), []); // fake data in mocks
});

// ── CLI end to end ───────────────────────────────────────────────────────────
const run = (args, input, env = {}) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { input, encoding: "utf8", env: { ...process.env, ...env } });

test("--pre blocks a Windows-path edit with exit 2", () => {
  const r = run(["--pre"], JSON.stringify({
    tool_name: "Write",
    tool_input: { file_path: "C:\\Users\\Zeven\\Desktop\\webblock-web\\src\\components\\common\\cta.tsx", content: "wa.me/855" },
  }), { CLAUDE_PROJECT_DIR: "C:\\Users\\Zeven\\Desktop\\webblock-web" });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /zero-transaction\/whatsapp/);
});

test("--pre checks Edit and MultiEdit new text, allows clean edits", () => {
  const edit = (tool_input) => run(["--pre"], JSON.stringify({ tool_input }), { CLAUDE_PROJECT_DIR: "/p" }).status;
  assert.equal(edit({ file_path: "/p/src/a.tsx", old_string: "x", new_string: "checkout()" }), 2);
  assert.equal(edit({ file_path: "/p/src/a.tsx", edits: [{ new_string: "ok" }, { new_string: "Buy now" }] }), 2);
  assert.equal(edit({ file_path: "/p/src/a.tsx", old_string: "x", new_string: "Contact us" }), 0);
});

test("--all scans src/ and fails on violations", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "wb-"));
  mkdirSync(path.join(dir, "src/features/products/components"), { recursive: true });
  writeFileSync(path.join(dir, "src/features/products/components/ok.tsx"), "export const A = () => <a href='tel:1'>Call us</a>;");
  assert.equal(run(["--all"], "", { CLAUDE_PROJECT_DIR: dir }).status, 0);
  writeFileSync(path.join(dir, "src/features/products/components/bad.tsx"), "export const B = () => <button>Buy now</button>;");
  const r = run(["--all"], "", { CLAUDE_PROJECT_DIR: dir });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /bad\.tsx:1/);
});
