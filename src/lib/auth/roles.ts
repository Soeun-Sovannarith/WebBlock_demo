// Shared by proxy.ts and session.ts. Keep this file free of server-only imports.

/** Mock session cookie. Replaced by the real Spring session when the backend exists. */
export const ROLE_COOKIE = "wb_role";

export type Role = "USER" | "ADMIN";

export function isRole(value: string | undefined): value is Role {
  return value === "USER" || value === "ADMIN";
}

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl: string | null;
};
