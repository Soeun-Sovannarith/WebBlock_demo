import type { SessionUser } from "@/lib/auth/roles";

export const sessionUsers: SessionUser[] = [
  {
    id: "0f8a2c4e-5b1d-4e7a-9c3f-2d6b8e1a7c90",
    email: "sokha.chan@example.com",
    fullName: "Sokha Chan",
    role: "USER",
    avatarUrl: null,
  },
  {
    id: "5c2e7a91-3d4b-4f6e-8a1c-9b0d2e3f4a51",
    email: "admin@webblock.app",
    fullName: "Dara Admin",
    role: "ADMIN",
    avatarUrl: null,
  },
];

/** Which user owns which website. */
export const websiteOwners: { websiteId: string; ownerId: string }[] = [
  {
    websiteId: "7d3e9b2a-1c4f-4a8e-b6d5-3f2e1a9c8b70",
    ownerId: "0f8a2c4e-5b1d-4e7a-9c3f-2d6b8e1a7c90",
  },
  {
    websiteId: "b4f1c8d2-6e3a-4b9f-a2d7-1c5e8f0b3a64",
    ownerId: "0f8a2c4e-5b1d-4e7a-9c3f-2d6b8e1a7c90",
  },
];
