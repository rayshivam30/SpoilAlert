import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const user = await requireAuth()

    const cartItems = await sql`
      SELECT 
        ci.*,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.stock_quantity,
        p.expiry_date
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${user.id}
      ORDER BY ci.created_at DESC
    `

    return NextResponse.json({ cartItems })
  } catch (error: any) {
    console.error("Get cart error:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Check if product exists and is in stock
    const products = await sql`
      SELECT id, stock_quantity, expiry_date
      FROM products
      WHERE id = ${productId} AND is_active = true
    `

    if (products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = products[0]

    // Check if product is expired
    if (product.expiry_date && new Date(product.expiry_date) < new Date()) {
      return NextResponse.json({ error: "Cannot add expired product to cart" }, { status: 400 })
    }

    if (product.stock_quantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Add or update cart item
    await sql`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (${user.id}, ${productId}, ${quantity})
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET 
        quantity = cart_items.quantity + ${quantity},
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Add to cart error:", error)
    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
