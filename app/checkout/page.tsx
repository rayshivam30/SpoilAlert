import { sql } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CheckoutClient from "@/components/CheckoutClient";

export default async function CheckoutPage({ searchParams }: { searchParams?: { productId?: string } }) {
  let items = [];
  let singleProduct = null;
  let total = 0;

  if (searchParams?.productId) {
    // Single product buy now
    const products = await sql`SELECT * FROM products WHERE id = ${searchParams.productId} AND is_active = true`;
    if (products.length > 0) {
      singleProduct = products[0];
      items = [{ ...singleProduct, quantity: 1 }];
      total = singleProduct.price;
    }
  } else {
    // Cart checkout
    // Simulate user id 1 for demo
    const cartItems = await sql`
      SELECT ci.*, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = 1
    `;
    items = cartItems;
    total = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }

  if (!items.length) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">No items to checkout.</div>;
  }

  // Dummy payment state (client only)
  return (
    <CheckoutClient items={items} total={total} />
  );
} 