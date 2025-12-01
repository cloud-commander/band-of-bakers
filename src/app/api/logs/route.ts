import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_LOGFLARE_API_KEY;
  const sourceId = process.env.NEXT_PUBLIC_LOGFLARE_SOURCE_ID;

  if (!apiKey || !sourceId) {
    return NextResponse.json({ error: "Logflare configuration missing" }, { status: 500 });
  }

  try {
    // Check if body is empty
    const text = await request.text();
    if (!text) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Forward to Logflare
    const response = await fetch("https://api.logflare.app/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        source: sourceId,
        log_entry: body.log_entry,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Logflare API error:", response.status, errorText);
      console.error("Debug Info:", {
        apiKeyLength: apiKey.length,
        sourceIdLength: sourceId.length,
        sourceIdMatch: sourceId === body.source_id,
      });
      return NextResponse.json(
        { error: "Failed to send log to Logflare" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in log proxy:", error);
    return NextResponse.json({ error: "Internal server error processing log" }, { status: 500 });
  }
}
