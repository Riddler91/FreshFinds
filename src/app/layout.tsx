import type { Metadata, Viewport } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FreshFinds — Local Food, Fresh Right Now",
  description:
    "Discover fresh, local, homemade food near you. Browse farm stands, cottage food vendors, and specialty producers in your area.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "FreshFinds",
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#7C9082",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${playfair.variable}`}>
      <head>
        {/* PWA / Apple meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="FreshFinds" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#7C9082" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen bg-cream-50 text-ink antialiased font-sans overscroll-none">
        <main className="relative">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
