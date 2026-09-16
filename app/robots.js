export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-gules-three.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/compte", "/profil", "/demandes", "/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe"],
      },
    ],
    sitemap: `${baseUrl.replace(/\\/$/, "")}/sitemap.xml`,
    host: baseUrl,
  };
}
