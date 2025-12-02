import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const hours = searchParams.get("hours");
  const title = searchParams.get("title") || "Order Pickup";

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const start = date;
  const end = date; // All-day event

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Band of Bakers//EN
BEGIN:VEVENT
SUMMARY:${title}
DTSTART;VALUE=DATE:${start.replace(/-/g, "")}
DTEND;VALUE=DATE:${end.replace(/-/g, "")}
DESCRIPTION:Collection hours: ${hours || ""}
END:VEVENT
END:VCALENDAR`;

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="order-pickup.ics"`,
    },
  });
}
