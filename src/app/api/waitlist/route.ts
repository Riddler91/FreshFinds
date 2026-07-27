import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";

// POST: Join the waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, city, userType } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const db = getRawDb();
    const now = new Date().toISOString();

    try {
      db.prepare(
        "INSERT INTO waitlist (email, city, user_type, created_at) VALUES (?, ?, ?, ?)"
      ).run(email.toLowerCase().trim(), city || null, userType || null, now);
    } catch (err: any) {
      if (err.message?.includes("UNIQUE constraint failed")) {
        return NextResponse.json(
          { message: "You're already on the waitlist! 🎉" },
          { status: 200 }
        );
      }
      throw err;
    }

    return NextResponse.json(
      { message: "You're on the list! We'll keep you posted." },
      { status: 201 }
    );
  } catch (err) {
    console.error("waitlist POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
