import { NextRequest, NextResponse } from "next/server";
import { getMessages, sendMessage } from "@/lib/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = parseInt(searchParams.get("vendorId") || "0", 10);

  if (!vendorId) {
    return NextResponse.json({ error: "vendorId is required" }, { status: 400 });
  }

  const messages = getMessages(vendorId);
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

  const message = sendMessage(vendorId, text);
  return NextResponse.json({ message }, { status: 201 });
}
