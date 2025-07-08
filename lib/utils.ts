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
