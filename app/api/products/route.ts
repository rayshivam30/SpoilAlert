import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const products = await sql`SELECT * FROM products WHERE is_active = true ORDER BY expiry_date ASC`;
  return NextResponse.json(products);
} 