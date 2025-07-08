"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/components/CartProvider";
import CartDrawerContent from "@/components/CartDrawerContent";
import { toast } from "@/hooks/use-toast";

export default function ProductActions({ productId, disabled, product }: { productId: number, disabled: boolean, product: any }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { refreshCart } = useCartContext();

  async function handleAddToCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Added to cart!", description: product?.name });
        refreshCart();
        if (CartDrawerContent.refresh) CartDrawerContent.refresh();
      } else {
        toast({ title: "Error", description: data.error || "Failed to add to cart" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  function handleBuyNow() {
    router.push(`/checkout?productId=${productId}`);
  }

  return (
    <div className="flex gap-4 mt-6">
      <Button size="lg" disabled={disabled || loading} onClick={handleAddToCart}>
        {loading ? "Adding..." : "Add to Cart"}
      </Button>
      <Button size="lg" variant="secondary" onClick={handleBuyNow}>
        Buy Now
      </Button>
    </div>
  );
} 