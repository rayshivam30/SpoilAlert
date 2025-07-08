"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCartContext } from "@/components/CartProvider";

export default function CartDrawerContent() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCartContext();

  async function fetchCart() {
    setLoading(true);
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setCartItems(data.cartItems || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  // Allow external refresh (for add to cart)
  CartDrawerContent.refresh = fetchCart;

  if (loading) {
    return <div className="p-4 text-center">Loading cart...</div>;
  }

  if (!cartItems.length) {
    return <div className="p-4 text-center text-muted-foreground">Your cart is empty.</div>;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
          <Image
            src={item.image_url || "/placeholder.jpg"}
            alt={item.name}
            width={64}
            height={64}
            className="rounded object-cover"
          />
          <div className="flex-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
            <div className="text-sm">{formatPrice(item.price)} each</div>
          </div>
          <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
        </div>
      ))}
      <div className="flex justify-between items-center pt-4 font-bold text-lg">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
} 