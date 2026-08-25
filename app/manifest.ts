import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DSR360 — B2B Sales Visit & CRM",
    short_name: "DSR360",
    description:
      "B2B Sales Visit & Customer Management System untuk DSR Shell Lubricants — PT Harapan Utama Motor",
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
