import type { Metadata, Viewport } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

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
  metadataBase: new URL(process.env.SITE_URL || "https://freshfinds.app"),
  title: {
    default: "FreshFinds — Discover Local Homemade Food Near You",
    template: "%s — FreshFinds",
  },
  description:
    "Discover fresh, local, homemade food near you. Browse farm stands, cottage food vendors, and specialty producers in your area. Find sourdough baked today, eggs gathered this morning, and produce picked fresh.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "FreshFinds",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: "FreshFinds",
    title: "FreshFinds — Discover Local Homemade Food Near You",
    description:
      "Discover fresh, local, homemade food near you. Browse farm stands, cottage food vendors, and specialty producers in your area.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshFinds — Discover Local Homemade Food Near You",
    description:
      "Discover fresh, local, homemade food near you. Browse farm stands, cottage food vendors, and specialty producers.",
  },
  robots: {
    index: true,
    follow: true,
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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FreshFinds",
              url: "https://freshfinds.app",
              description:
                "Discover fresh, local, homemade food near you. Browse farm stands, cottage food vendors, and specialty producers.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://freshfinds.app/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-cream-50 text-ink antialiased font-sans overscroll-none">
        <main className="relative">{children}</main>
        <BottomNav />
        {/* Privacy-respecting analytics — no third-party scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var sessionId = localStorage.getItem('ff_sid');
    if (!sessionId) {
      sessionId = 's' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
      localStorage.setItem('ff_sid', sessionId);
    }
    var city = localStorage.getItem('ff-selected-city') || '';
    var referrer = document.referrer || '';
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        city: city,
        sessionId: sessionId,
        referrer: referrer
      }),
      keepalive: true
    }).catch(function(){});
  } catch(e) {}
})();
`,
          }}
        />
      </body>
    </html>
  );
}
