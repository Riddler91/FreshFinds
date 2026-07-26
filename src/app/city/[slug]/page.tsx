import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES, MOCK_VENDORS, MOCK_LISTINGS_WITH_EXPIRY, type CityDef } from "@/lib/data";
import CityPageClient from "./client";

export function generateStaticParams() {
  return CITIES.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = CITIES.find((c) => c.slug === slug);
  if (!city) return { title: "City Not Found — FreshFinds" };

  const vendorCount = MOCK_VENDORS.filter(
    (v) => v.city?.toLowerCase() === city.name.toLowerCase()
  ).length;
  const freshCount = MOCK_LISTINGS_WITH_EXPIRY.filter(
    (l) =>
      (l as any).city?.toLowerCase() === city.name.toLowerCase() &&
      new Date((l as any).expiresAt).getTime() > Date.now()
  ).length;

  return {
    title: `Fresh Food in ${city.name}, ${city.state} — FreshFinds`,
    description: `Discover ${vendorCount} local cottage food vendors in ${city.name} with ${freshCount} items available right now. ${city.tagline}`,
    openGraph: {
      title: `Fresh Food in ${city.name}, ${city.state} — FreshFinds`,
      description: `${city.tagline} Browse ${vendorCount} vendors and ${freshCount} fresh items in ${city.name}.`,
      type: "website",
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = CITIES.find((c) => c.slug === slug.toLowerCase());
  if (!city) notFound();

  const cityVendors = MOCK_VENDORS.filter(
    (v) => v.city?.toLowerCase() === city.name.toLowerCase()
  );

  const cityListings = MOCK_LISTINGS_WITH_EXPIRY.filter(
    (l) =>
      (l as any).city?.toLowerCase() === city.name.toLowerCase()
  );

  const freshListings = cityListings.filter(
    (l) => new Date((l as any).expiresAt).getTime() > Date.now()
  );

  const categories = [...new Set(cityVendors.map((v) => v.categoryName))];

  return (
    <CityPageClient
      city={city}
      vendorCount={cityVendors.length}
      freshCount={freshListings.length}
      categories={categories}
      initialVendors={cityVendors}
      initialListings={freshListings.slice(0, 6)}
    />
  );
}
