import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    TEXTBOOKS: "📚",
    LAB_RECORDS: "📓",
    CALCULATORS: "🧮",
    DRAWING_INSTRUMENTS: "📐",
    FURNITURE: "🪑",
    ELECTRONICS: "💻",
    CLOTHING: "👕",
    STATIONERY: "✏️",
    CYCLES: "🚲",
    OTHER: "📦",
  }
  return emojis[category] || "📦"
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    NEW: "New",
    LIKE_NEW: "Like New",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
  }
  return labels[condition] || condition
}

export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SELL: "For Sale",
    EXCHANGE: "For Exchange",
    DONATE: "Free",
    RENT: "For Rent",
  }
  return labels[type] || type
}

export const FEATURE_COST_POINTS = 50
export const FEATURE_DURATION_DAYS = 7

export function getDepartmentOptions() {
  return [
    "Computer Science",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biotechnology",
    "Information Technology",
    "Production",
    "Other",
  ]
}
