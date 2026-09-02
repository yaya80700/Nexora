import "./globals.css";

export const metadata = {
  title: "Nexora — Créons. Apprenons. Évoluons.",
  description: "Nexora, une plateforme numérique qui réunit formations, services et projets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
