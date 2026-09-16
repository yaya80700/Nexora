import { getCustomNavPages } from "../lib/nexora/siteContent";

const publicRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/formations", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projets", changeFrequency: "weekly", priority: 0.9 },
  { path: "/sites", changeFrequency: "monthly", priority: 0.8 },
  { path: "/abonnements", changeFrequency: "monthly", priority: 0.8 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-gules-three.vercel.app").replace(/\/$/, "");
  const now = new Date();
  let customPages = [];

  try {
    customPages = await getCustomNavPages();
  } catch {}

  const customEntries = customPages
    .filter((page) => page?.slug)
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [
    ...publicRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...customEntries,
  ];
}
