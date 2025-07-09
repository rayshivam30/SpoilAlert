"use client";
import { ProductCard } from "./product-card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function FeaturedProducts({ products }: { products: any[] }) {
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleAddToCart(productId: number) {
    setLoadingId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.status === 401 || res.status === 403) {
        toast({
          title: "Not logged in",
          description: "Please log in to add items to your cart.",
        });
        window.location.href = "/login";
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.error === "Authentication required") {
        toast({
          title: "Not logged in",
          description: "Please log in to add items to your cart.",
        });
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Could not add product to cart.",
        });
        return;
      }
      toast({
        title: "Added to cart!",
        description: "Product has been added to your cart.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not add product to cart.",
      });
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
} 