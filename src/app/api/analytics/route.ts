import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "freshfinds2024";

// ── POST: Record a page view ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, city, sessionId } = body;

    if (!path || !sessionId) {
      return NextResponse.json({ error: "path and sessionId are required" }, { status: 400 });
    }

    const db = getRawDb();
    const now = new Date().toISOString();

    db.prepare(
      "INSERT INTO page_views (path, city, session_id, timestamp) VALUES (?, ?, ?, ?)"
    ).run(path, city || null, sessionId, now);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("analytics POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ── GET: Fetch analytics stats (password-protected) ───────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getRawDb();

  // Total page views
  const totalRow = db.prepare("SELECT COUNT(*) as count FROM page_views").get() as any;
  const totalViews = totalRow.count;

  // Today's views
  const today = new Date().toISOString().slice(0, 10); // "2026-07-26"
  const todayRow = db.prepare(
    "SELECT COUNT(*) as count FROM page_views WHERE timestamp >= ?"
  ).get(today) as any;
  const todayViews = todayRow.count;

  // Unique visitors (all time)
  const uniqueRow = db.prepare(
    "SELECT COUNT(DISTINCT session_id) as count FROM page_views"
  ).get() as any;
  const uniqueVisitors = uniqueRow.count;

  // Unique visitors (today)
  const uniqueTodayRow = db.prepare(
    "SELECT COUNT(DISTINCT session_id) as count FROM page_views WHERE timestamp >= ?"
  ).get(today) as any;
  const uniqueTodayVisitors = uniqueTodayRow.count;

  // Views by city
  const byCity = db.prepare(
    "SELECT city, COUNT(*) as count FROM page_views WHERE city IS NOT NULL AND city != '' GROUP BY city ORDER BY count DESC"
  ).all() as any[];

  // Views by page
  const byPage = db.prepare(
    "SELECT path, COUNT(*) as count FROM page_views GROUP BY path ORDER BY count DESC"
  ).all() as any[];

  // Recent activity (last 20)
  const recent = db.prepare(
    "SELECT path, city, session_id, timestamp FROM page_views ORDER BY timestamp DESC LIMIT 20"
  ).all() as any[];

  return NextResponse.json({
    totalViews,
    todayViews,
    uniqueVisitors,
    uniqueTodayVisitors,
    byCity,
    byPage,
    recent,
  });
}
