import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function isExpired(expiryDate: string | Date): boolean {
  return new Date(expiryDate) < new Date()
}

export function isExpiringSoon(expiryDate: string | Date, daysThreshold = 3): boolean {
  const expiry = new Date(expiryDate)
  const threshold = new Date()
  threshold.setDate(threshold.getDate() + daysThreshold)
  return expiry <= threshold && expiry >= new Date()
}

export function getExpiryStatus(expiryDate: string | Date | null): "expired" | "expiring" | "fresh" {
  if (!expiryDate) return "fresh"

  if (isExpired(expiryDate)) return "expired"
  if (isExpiringSoon(expiryDate)) return "expiring"
  return "fresh"
}

// Predict if a product will sell before expiry (simple rule-based)
export function willProductSellBeforeExpiry(stock: number, avgDailySales: number, daysToExpiry: number): boolean {
  if (avgDailySales <= 0) return false;
  // If expected sales before expiry >= stock, it will sell
  return avgDailySales * daysToExpiry >= stock;
}

// Suggest a dynamic discount percentage based on days to expiry and risk
export function suggestDiscount(daysToExpiry: number, atRisk: boolean): number {
  if (!atRisk) return 0;
  if (daysToExpiry <= 1) return 40;
  if (daysToExpiry <= 3) return 30;
  if (daysToExpiry <= 7) return 20;
  return 10;
}
