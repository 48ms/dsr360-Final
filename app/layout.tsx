import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { ToastProvider } from "@/components/ui/toast-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nyales24/7 | AI B2B Sales Operating System by Bima Maulana Saputra",
  description: "24/7 AI-Powered B2B Sales Operating System & Field Intelligence Engine by Bima Maulana Saputra",
  applicationName: "Nyales24/7",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nyales24/7",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  manifest: "/manifest.json",
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
    <html lang="id" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-neutral-50 font-sans">
        <ToastProvider>
          <OfflineIndicator />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
