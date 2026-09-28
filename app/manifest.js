export default function manifest() {
  return {
    name: "Nexora",
    short_name: "Nexora",
    description: "Formations, développement, services et projets numériques.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b14",
    theme_color: "#111827",
    icons: [
      {
        src: "/nexora-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
