import type { Metadata, Viewport } from "next";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSR360 — B2B Sales Visit & CRM",
  description: "B2B Sales Visit & Customer Management — PT Harapan Utama Motor",
  applicationName: "DSR360",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DSR360",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F59E0B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50">
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
