import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES, type CityDef } from "@/lib/data";
import CityPageClient from "./client";

export function generateStaticParams() {
  return CITIES.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = CITIES.find((c) => c.slug === slug);
  if (!city) return { title: "City Not Found — FreshFinds" };

  return {
    title: `FreshFinds in ${city.name}, ${city.state} — Local Food Coming Soon`,
    description: `${city.tagline} FreshFinds is launching in ${city.name}. Be the first cottage food vendor to join or discover homemade local food near you.`,
    openGraph: {
      title: `FreshFinds in ${city.name}, ${city.state} — Local Food Coming Soon`,
      description: `${city.tagline} Join FreshFinds to discover or sell homemade local food in ${city.name}.`,
      type: "website",
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = CITIES.find((c) => c.slug === slug.toLowerCase());
  if (!city) notFound();

  // Clean slate: no mock vendors or listings — only real signups appear
  return (
    <CityPageClient
      city={city}
      vendorCount={0}
      freshCount={0}
      categories={[]}
      initialVendors={[]}
      initialListings={[]}
    />
  );
}
