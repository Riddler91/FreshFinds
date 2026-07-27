import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";

// POST: Record a page view with referrer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, city, sessionId, referrer } = body;

    if (!path || !sessionId) {
      return NextResponse.json(
        { error: "path and sessionId are required" },
        { status: 400 }
      );
    }

    const db = getRawDb();
    const now = new Date().toISOString();

    db.prepare(
      "INSERT INTO page_views (path, city, session_id, referrer, timestamp) VALUES (?, ?, ?, ?, ?)"
    ).run(path, city || null, sessionId, referrer || null, now);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("analytics/pageview POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
