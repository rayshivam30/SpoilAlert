"use client";
import { formatDate, willProductSellBeforeExpiry, suggestDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface ProductInsightProps {
  product: {
    id: number;
    name: string;
    stock_quantity: number;
    expiry_date?: string;
    price: number;
    discount?: number;
    // Add more fields as needed
  };
  avgDailySales?: number; // Optional, default to 2
}

export default function ProductInsight({ product, avgDailySales = 2 }: ProductInsightProps) {
  const today = useMemo(() => new Date(), []);
  const expiryDate = product.expiry_date ? new Date(product.expiry_date) : null;
  const daysToExpiry = expiryDate ? Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const willSell = willProductSellBeforeExpiry(product.stock_quantity, avgDailySales, daysToExpiry);
  const atRisk = !willSell;
  const discount = suggestDiscount(daysToExpiry, atRisk);

  // Explainable factors
  let reason = "";
  if (atRisk) {
    if (daysToExpiry <= 1) reason = "Very close to expiry.";
    else if (product.stock_quantity > avgDailySales * daysToExpiry) reason = "Stock is high compared to expected sales.";
    else reason = "Low sales speed or short expiry.";
  } else {
    reason = "Stock is likely to sell before expiry.";
  }

  // Suggested next action
  let action = atRisk ? `Apply ${discount}% discount now` : "No action needed";

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6 shadow">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-bold text-lg">Product Insights</span>
        {atRisk ? (
          <Badge variant="destructive">At Risk</Badge>
        ) : (
          <Badge variant="success">Will Sell</Badge>
        )}
      </div>
      <div className="mb-1 text-sm">
        <span className="font-semibold">Days to Expiry:</span> {daysToExpiry}
      </div>
      <div className="mb-1 text-sm">
        <span className="font-semibold">Current Discount:</span> {product.discount ? `${product.discount}%` : "None"}
      </div>
      <div className="mb-1 text-sm">
        <span className="font-semibold">AI Suggestion:</span> {atRisk ? `${discount}% discount suggested` : "No discount needed"}
      </div>
      <div className="mb-1 text-sm">
        <span className="font-semibold">Why this discount?</span> {reason}
      </div>
      <div className="mt-2 text-blue-900 font-semibold">
        Suggested Action: {action}
      </div>
    </div>
  );
} 