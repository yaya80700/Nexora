import "./globals.css";

export const metadata = {
  title: "Nexora — Créons. Apprenons. Évoluons.",
  description: "Nexora rassemble formations, développement, services et projets numériques.",
};

export default function RootLayout({ children }) {
  return <html lang="fr"><body>{children}</body></html>;
}
