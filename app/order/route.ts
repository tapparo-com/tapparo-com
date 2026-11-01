import { NextResponse } from "next/server";
import { ORDER_DESTINATION } from "@/lib/ordering";

export function GET() {
  // Keep the destination changeable and independent of CMS availability or site layouts.
  return NextResponse.redirect(ORDER_DESTINATION, {
    status: 307,
    headers: { "Cache-Control": "no-store" },
  });
}
