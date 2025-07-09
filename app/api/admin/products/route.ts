import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const { action, productIds, reason } = await request.json();
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
    }
    if (action === "remove") {
      await sql`
        UPDATE products SET is_active = false WHERE id = ANY(${productIds})
      `;
      return NextResponse.json({ success: true, removed: productIds.length });
    } else if (action === "donate") {
      await sql`
        UPDATE products SET donated = true WHERE id = ANY(${productIds})
      `;
      // Optionally, log the donation reason somewhere
      return NextResponse.json({ success: true, donated: productIds.length, reason });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized or server error" }, { status: 401 });
  }
} 