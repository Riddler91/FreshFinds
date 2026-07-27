import type { Metadata } from "next";
import { getRawDb } from "@/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vendorId = parseInt(id, 10);

  if (isNaN(vendorId)) {
    return { title: "Vendor Not Found — FreshFinds" };
  }

  try {
    const db = getRawDb();
    const vendor = db
      .prepare(
        "SELECT business_name, city, state, bio, category_name FROM vendors WHERE id = ?"
      )
      .get(vendorId) as any;

    if (!vendor) {
      return { title: "Vendor Not Found — FreshFinds" };
    }

    const cityLabel = vendor.city ? ` ${vendor.city}` : "";
    const title = `${vendor.business_name} — FreshFinds${cityLabel}`;
    const description =
      vendor.bio?.slice(0, 160) ||
      `${vendor.business_name} is a ${vendor.category_name?.toLowerCase() || "cottage food"} vendor on FreshFinds. Browse their fresh, homemade products available for local pickup.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
      },
      alternates: {
        canonical: `/vendor/${vendorId}`,
      },
    };
  } catch {
    return { title: "Vendor — FreshFinds" };
  }
}

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
