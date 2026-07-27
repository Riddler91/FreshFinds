import { MetadataRoute } from "next";
import { CITIES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "https://freshfinds.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/feed`, lastModified: new Date(), changeFrequency: "always" as const, priority: 0.9 },
    { url: `${baseUrl}/onboarding`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/demo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  ];

  const cityPages = CITIES.map((city) => ({
    url: `${baseUrl}/city/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...cityPages];
}
