"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, AlertTriangle, Clock } from "lucide-react"
import type { Product } from "@/lib/db"
import { formatPrice, getExpiryStatus, formatDate } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const expiryStatus = getExpiryStatus(product.expiry_date)

  const getExpiryBadge = () => {
    switch (expiryStatus) {
      case "expired":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Expired
          </Badge>
        )
      case "expiring":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3" />
            Expires Soon
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">{getExpiryBadge()}</div>
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
          <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
        </div>

        {product.expiry_date && (
          <p className="text-xs text-muted-foreground">Expires: {formatDate(product.expiry_date)}</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart?.(product.id)}
          disabled={product.stock_quantity === 0 || expiryStatus === "expired"}
          className="w-full"
          variant={expiryStatus === "expired" ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {expiryStatus === "expired" ? "Expired" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
