import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ShoppingBag, Truck, Shield, Clock } from "lucide-react"
import FeaturedProducts from "@/components/featured-products";

async function getFeaturedProducts() {
  const products = await sql`
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
    ORDER BY p.created_at DESC
    LIMIT 8
  `
  return products
}

async function getCategories() {
  const categories = await sql`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
    GROUP BY c.id, c.name, c.slug, c.description
    ORDER BY c.name
  `
  return categories
}

async function getCartItemCount(userId?: number) {
  if (!userId) return 0

  const result = await sql`
    SELECT COALESCE(SUM(quantity), 0) as total
    FROM cart_items
    WHERE user_id = ${userId}
  `
  return Number(result[0]?.total || 0)
}

export default async function HomePage() {
  const user = await getCurrentUser()
  const [products, categories, cartItemCount] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getCartItemCount(user?.id),
  ])

  const dummyImage = "/placeholder.jpg";
  const featuredProducts = products.map((product, idx) => ({
    ...product,
    image_url: product.image_url || dummyImage,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Fresh Food, Delivered Fast</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Quality groceries with expiry tracking for your peace of mind
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
            <Link href={user ? "/products" : "/login"}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Link>
          </Button>
          {(!user || user.role !== "admin") && (
            <div className="mt-8 flex flex-col items-center">
              <div className="bg-orange-100 text-orange-800 rounded-lg px-6 py-4 mb-4 max-w-lg text-center shadow">
                <strong>Are you a store manager or hackathon judge?</strong><br />
                Experience our AI-powered inventory dashboard!
              </div>
              <Button size="lg" variant="outline" className="text-orange-700 border-orange-400 hover:bg-orange-50" asChild>
                <Link href="/login">Try as Admin / Manager</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expiry Tracking</h3>
              <p className="text-muted-foreground">
                Never buy expired products. We track expiry dates for your safety.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Same-day delivery available for fresh groceries in your area.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">100% satisfaction guarantee on all fresh products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category: any) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">{category.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <Badge variant="secondary">{category.product_count} items</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
          <FeaturedProducts products={featuredProducts} />
        </div>
      </section>
    </div>
  )
}
