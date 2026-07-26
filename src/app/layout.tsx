import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "FreshFinds — Local Food, Fresh Right Now",
  description:
    "Discover homemade food, farm stands, and cottage food vendors near you in Austin, TX.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
