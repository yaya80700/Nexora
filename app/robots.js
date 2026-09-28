export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-plateforme.fr";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/compte", "/profil", "/demandes", "/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe", "/notifications", "/parametres", "/academy"],
      },
    ],
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: baseUrl,
  };
}
