import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, Users, ShoppingCart, Plus } from "lucide-react"
import Link from "next/link"
import { getExpiryStatus, formatDate } from "@/lib/utils"

async function getDashboardStats() {
  const [products, users, cartItems, expiringProducts] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM products WHERE is_active = true`,
    sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`,
    sql`SELECT COUNT(*) as count FROM cart_items`,
    sql`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE expiry_date <= CURRENT_TIMESTAMP + INTERVAL '3 days'
      AND expiry_date >= CURRENT_TIMESTAMP
      AND is_active = true
    `,
  ])

  return {
    totalProducts: Number(products[0].count),
    totalUsers: Number(users[0].count),
    totalCartItems: Number(cartItems[0].count),
    expiringProducts: Number(expiringProducts[0].count),
  }
}

async function getExpiringProducts() {
  const products = await sql`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.expiry_date <= CURRENT_TIMESTAMP + INTERVAL '7 days'
    AND p.is_active = true
    ORDER BY p.expiry_date ASC
    LIMIT 10
  `
  return products
}

export default async function AdminDashboard() {
  const user = await requireAdmin()
  const [stats, expiringProducts] = await Promise.all([getDashboardStats(), getExpiringProducts()])

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your food inventory and track expiry dates</p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCartItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/admin/products">View All Products</Link>
              </Button>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/admin/products/new">Add New Product</Link>
              </Button>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/admin/categories">Manage Categories</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/admin/users">View All Users</Link>
              </Button>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/admin/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/admin/reports/expiry">Expiry Report</Link>
              </Button>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/admin/reports/sales">Sales Report</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Expiring Products Alert */}
        {expiringProducts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Products Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringProducts.map((product: any) => {
                  const expiryStatus = getExpiryStatus(product.expiry_date)
                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.category_name} • Stock: {product.stock_quantity}
                        </p>
                        <p className="text-sm">Expires: {formatDate(product.expiry_date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={expiryStatus === "expired" ? "destructive" : "secondary"}
                          className={expiryStatus === "expiring" ? "bg-orange-100 text-orange-800" : ""}
                        >
                          {expiryStatus === "expired" ? "Expired" : "Expires Soon"}
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/admin/reports/expiry">View Full Expiry Report</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
