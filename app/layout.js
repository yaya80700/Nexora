import "./globals.css";
export const metadata={
 title:{default:"Nexora — Créons. Apprenons. Évoluons.",template:"%s — Nexora"},
 description:"Nexora rassemble formations, développement, services et projets numériques dans une plateforme moderne et évolutive.",
 keywords:["Nexora","développement","FiveM","GMod","formations","site web","optimisation PC","services numériques"],
 authors:[{name:"Nexora"}],
 icons:{icon:"/nexora-logo.png",apple:"/nexora-logo.png"},
 metadataBase:new URL("https://nexora.vercel.app")
};
export default function RootLayout({children}){return <html lang="fr"><body>{children}</body></html>}
