import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";

// POST: Record a custom analytics event (e.g., onboarding-started, onboarding-completed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, path, city, sessionId, properties } = body;

    if (!event || !sessionId) {
      return NextResponse.json(
        { error: "event and sessionId are required" },
        { status: 400 }
      );
    }

    const db = getRawDb();
    const now = new Date().toISOString();

    db.prepare(
      "INSERT INTO analytics_events (event, path, city, session_id, properties, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(
      event,
      path || null,
      city || null,
      sessionId,
      properties ? JSON.stringify(properties) : null,
      now
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("analytics/event POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
