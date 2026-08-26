import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nyales24/7 | AI B2B Sales Operating System",
    short_name: "Nyales24/7",
    description:
      "24/7 AI-Powered B2B Sales Operating System & Field Intelligence Engine by Bima Maulana Saputra",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAFAFA",
    theme_color: "#F59E0B",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
