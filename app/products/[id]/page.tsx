import { sql } from "@/lib/db";
import { formatPrice, formatDate, getExpiryStatus } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import ProductActions from "@/components/ProductActions";
import BackButton from "@/components/BackButton";
import ProductInsight from "@/components/ProductInsight";
import { getCurrentUser } from "@/lib/auth";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;
  // Fetch product with category info
  const products = await sql`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id} AND p.is_active = true
  `;
  const product = products[0];
  const dummyImage = "/placeholder.jpg";

  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Product not found.</div>;
  }

  const expiryStatus = getExpiryStatus(product.expiry_date);

  // Fetch suggested products (same category, exclude current)
  const suggested = await sql`
    SELECT * FROM products WHERE is_active = true AND category_id = ${product.category_id} AND id != ${product.id} LIMIT 10
  `;

  // Fetch current user (server-side)
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      {user?.role === "admin" && <ProductInsight product={product} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md aspect-square relative mb-4">
            <Image
              src={product.image_url || dummyImage}
              alt={product.name}
              fill
              className="object-contain rounded border"
              priority
            />
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <div className="mb-2 text-green-600 font-semibold">Special price</div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-green-700">{formatPrice(product.price)}</span>
          </div>
          <div className="mb-4 text-muted-foreground">{product.description}</div>
          <div className="mb-4 flex flex-col gap-1">
            <span>Category: <Link href={`/category/${product.category_slug}`} className="underline hover:text-blue-600">{product.category_name}</Link></span>
            <span>Stock: {product.stock_quantity}</span>
            {product.expiry_date && (
              <span>Expires: {formatDate(product.expiry_date)}</span>
            )}
            {expiryStatus === "expired" && <span className="text-red-500 font-semibold">Expired</span>}
            {expiryStatus === "expiring" && <span className="text-orange-500 font-semibold">Expiring Soon</span>}
          </div>
          {/* Offers (static for now) */}
          <div className="mb-6">
            <div className="font-semibold mb-1">Available offers</div>
            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
              <li>Bank Offer: 5% cashback on select cards</li>
              <li>Special Price: Extra 10% off (see T&C)</li>
              <li>Free delivery on orders over $50</li>
            </ul>
          </div>
          <Suspense fallback={<div>Loading actions...</div>}>
            <ProductActions productId={product.id} disabled={product.stock_quantity === 0 || expiryStatus === "expired"} product={product} />
          </Suspense>
        </div>
      </div>

      {/* Suggested Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">You may also like</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {suggested.length === 0 ? (
            <div className="text-muted-foreground">No suggestions available.</div>
          ) : (
            suggested.map((item: any) => (
              <Link key={item.id} href={`/products/${item.id}`} className="min-w-[220px] max-w-xs flex-shrink-0">
                <div className="rounded-lg border shadow hover:shadow-lg transition-all bg-white">
                  <div className="relative aspect-square w-full h-40">
                    <Image
                      src={item.image_url || dummyImage}
                      alt={item.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold line-clamp-1 mb-1">{item.name}</div>
                    <div className="text-green-700 font-bold mb-1">{formatPrice(item.price)}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{item.description}</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 