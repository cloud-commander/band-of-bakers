import { NextRequest, NextResponse } from "next/server";
import { runOverdueOrderSweep } from "@/actions/overdue-orders";

export const runtime = "nodejs";

function authorize(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("x-cron-secret");
  return header === secret;
}

async function handle(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = Boolean(body?.dryRun);
  const autoCloseAfterDays =
    body?.autoCloseAfterDays === null || body?.autoCloseAfterDays === undefined
      ? null
      : Number(body.autoCloseAfterDays);

  const result = await runOverdueOrderSweep({ dryRun, autoCloseAfterDays });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}
