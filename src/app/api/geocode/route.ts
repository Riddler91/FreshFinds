import { NextRequest, NextResponse } from "next/server";
import { geocodeZip } from "@/lib/geocode";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip") || "";

  if (!zip || zip.length < 5) {
    return NextResponse.json({ error: "Valid 5-digit ZIP code required" }, { status: 400 });
  }

  const result = await geocodeZip(zip);
  if (!result) {
    return NextResponse.json({ error: "ZIP code not found" }, { status: 404 });
  }

  return NextResponse.json({ result });
}
