import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "freshfinds2024";

// ── POST: Record a page view ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, city, sessionId, referrer } = body;

    if (!path || !sessionId) {
      return NextResponse.json({ error: "path and sessionId are required" }, { status: 400 });
    }

    const db = getRawDb();
    const now = new Date().toISOString();

    db.prepare(
      "INSERT INTO page_views (path, city, session_id, referrer, timestamp) VALUES (?, ?, ?, ?, ?)"
    ).run(path, city || null, sessionId, referrer || null, now);

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
  const today = new Date().toISOString().slice(0, 10);
  const todayRow = db.prepare(
    "SELECT COUNT(*) as count FROM page_views WHERE timestamp >= ?"
  ).get(today) as any;
  const todayViews = todayRow.count;

  // This week's views (Monday 00:00 to now)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // days since Monday
  const monday = new Date(now);
  monday.setDate(monday.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);
  const weekStart = monday.toISOString();
  const weekRow = db.prepare(
    "SELECT COUNT(*) as count FROM page_views WHERE timestamp >= ?"
  ).get(weekStart) as any;
  const weekViews = weekRow.count;

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

  // Unique visitors (this week)
  const uniqueWeekRow = db.prepare(
    "SELECT COUNT(DISTINCT session_id) as count FROM page_views WHERE timestamp >= ?"
  ).get(weekStart) as any;
  const uniqueWeekVisitors = uniqueWeekRow.count;

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
    "SELECT path, city, session_id, referrer, timestamp FROM page_views ORDER BY timestamp DESC LIMIT 20"
  ).all() as any[];

  // ── Funnel: Vendor signup events ────────────────────────────
  const funnelStarted = db.prepare(
    "SELECT COUNT(*) as count FROM analytics_events WHERE event = 'onboarding-started'"
  ).get() as any;
  const funnelCompleted = db.prepare(
    "SELECT COUNT(*) as count FROM analytics_events WHERE event = 'onboarding-completed'"
  ).get() as any;

  // ── Waitlist signups ────────────────────────────────────────
  const waitlistTotal = db.prepare(
    "SELECT COUNT(*) as count FROM waitlist"
  ).get() as any;
  const waitlistBuyers = db.prepare(
    "SELECT COUNT(*) as count FROM waitlist WHERE user_type = 'buyer'"
  ).get() as any;
  const waitlistSellers = db.prepare(
    "SELECT COUNT(*) as count FROM waitlist WHERE user_type = 'seller'"
  ).get() as any;
  const waitlistToday = db.prepare(
    "SELECT COUNT(*) as count FROM waitlist WHERE created_at >= ?"
  ).get(today) as any;

  const recentWaitlist = db.prepare(
    "SELECT email, city, user_type, created_at FROM waitlist ORDER BY created_at DESC LIMIT 20"
  ).all() as any[];

  return NextResponse.json({
    totalViews,
    todayViews,
    weekViews,
    uniqueVisitors,
    uniqueTodayVisitors,
    uniqueWeekVisitors,
    byCity,
    byPage,
    recent,
    funnel: {
      onboardingStarted: funnelStarted.count,
      onboardingCompleted: funnelCompleted.count,
      conversionRate:
        funnelStarted.count > 0
          ? Math.round((funnelCompleted.count / funnelStarted.count) * 100)
          : 0,
    },
    waitlist: {
      total: waitlistTotal.count,
      buyers: waitlistBuyers.count,
      sellers: waitlistSellers.count,
      today: waitlistToday.count,
      recent: recentWaitlist,
    },
  });
}
