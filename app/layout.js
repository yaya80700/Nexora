import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://nexora-plateforme.fr").replace(/\/$/, "");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexora — Créons. Apprenons. Évoluons.",
    template: "%s — Nexora",
  },
  description: "Nexora rassemble formations, développement, création de sites, services numériques et projets sur mesure dans une plateforme moderne et évolutive.",
  keywords: [
    "Nexora",
    "développement FiveM",
    "développement GMod",
    "création site web",
    "formation FiveM",
    "formation GMod",
    "formation Python",
    "formation Java",
    "optimisation PC",
    "services numériques",
    "projets sur mesure",
  ],
  authors: [{ name: "Nexora" }],
  creator: "Nexora",
  publisher: "Nexora",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Nexora",
    title: "Nexora — Créons. Apprenons. Évoluons.",
    description: "Formations, développement, création de sites, services numériques et projets sur mesure.",
    images: [
      {
        url: "/nexora-logo.png",
        width: 512,
        height: 512,
        alt: "Nexora",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Nexora — Créons. Apprenons. Évoluons.",
    description: "Formations, développement, création de sites et projets numériques sur mesure.",
    images: ["/nexora-logo.png"],
  },
  icons: {
    icon: "/nexora-logo.png",
    apple: "/nexora-logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Nexora",
      url: siteUrl,
      logo: `${siteUrl}/nexora-logo.png`,
      description: "Formations, développement, création de sites, services numériques et projets sur mesure.",
    },
    {
      "@type": "WebSite",
      name: "Nexora",
      url: siteUrl,
      inLanguage: "fr-FR",
      description: "Plateforme de formations, développement, services et projets numériques.",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}
