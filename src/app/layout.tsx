import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "FreshFinds — Local Food, Fresh Right Now",
  description:
    "Discover homemade food, farm stands, and cottage food vendors near you in Austin, TX.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="relative">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
