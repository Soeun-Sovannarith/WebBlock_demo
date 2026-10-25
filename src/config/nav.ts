// Sidebar items. No count badges.

export type NavItem = {
  label: string;
  href: string;
  /** Only active on this exact path (for section roots like /admin). */
  exact?: boolean;
};

export const userNav: NavItem[] = [
  { label: "Websites", href: "/websites" },
  { label: "Templates", href: "/templates" },
  { label: "Settings", href: "/settings" },
];

export function ownerNav(websiteId: string): NavItem[] {
  const base = `/portal/${websiteId}`;
  return [
    { label: "Products", href: `${base}/products` },
    { label: "Business info", href: `${base}/info` },
    { label: "Monitoring", href: `${base}/monitoring` },
  ];
}

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", exact: true },
  { label: "Users", href: "/admin/users" },
  { label: "Websites", href: "/admin/websites" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
  { label: "Plans", href: "/admin/plans" },
  { label: "Notifications", href: "/admin/notifications" },
  { label: "Pipeline", href: "/admin/monitoring/pipeline" },
  { label: "Activity", href: "/admin/monitoring/activity" },
];
