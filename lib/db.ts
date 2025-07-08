import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: number
  email: string
  name: string
  role: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  image_url?: string
  category_id: number
  stock_quantity: number
  expiry_date?: string
  is_active: boolean
  category?: Category
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product?: Product
}
