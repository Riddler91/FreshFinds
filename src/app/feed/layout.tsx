import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fresh Right Now — Just-Baked & Freshly Harvested Near You",
  description:
    "See what's fresh right now near you — sourdough baked this morning, eggs gathered today, produce picked hours ago. Real-time local food feed from cottage food vendors.",
  openGraph: {
    title: "Fresh Right Now — Just-Baked & Freshly Harvested Near You",
    description:
      "See what's fresh right now near you — sourdough baked this morning, eggs gathered today, produce picked hours ago.",
    type: "website",
  },
  alternates: {
    canonical: "/feed",
  },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
