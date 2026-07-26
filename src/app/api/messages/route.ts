import { NextRequest, NextResponse } from "next/server";
import { getRawDb } from "@/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = parseInt(searchParams.get("vendorId") || "0", 10);

  if (!vendorId) {
    return NextResponse.json({ error: "vendorId is required" }, { status: 400 });
  }

  const db = getRawDb();
  const rows = db.prepare(
    "SELECT * FROM messages WHERE vendor_id = ? ORDER BY created_at ASC"
  ).all(vendorId) as any[];

  const messages = rows.map((m: any) => ({
    id: m.id,
    vendorId: m.vendor_id,
    text: m.text,
    sender: m.sender,
    createdAt: m.created_at,
  }));

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const vendorId = body.vendorId;
  const text = (body.text || "").trim();

  if (!vendorId || !text) {
    return NextResponse.json({ error: "vendorId and text are required" }, { status: 400 });
  }

  if (text.length > 1000) {
    return NextResponse.json({ error: "Message too long (max 1000 chars)" }, { status: 400 });
  }

  const db = getRawDb();
  const now = new Date().toISOString();

  const result = db.prepare(
    "INSERT INTO messages (vendor_id, text, sender, created_at) VALUES (?, ?, 'consumer', ?)"
  ).run(vendorId, text, now);

  const message = {
    id: Number(result.lastInsertRowid),
    vendorId,
    text,
    sender: "consumer",
    createdAt: now,
  };

  return NextResponse.json({ message }, { status: 201 });
}
