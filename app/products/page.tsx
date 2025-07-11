import { sql } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

export default async function ProductsPage({ searchParams }: { searchParams?: { search?: string } }) {
  const search = searchParams?.search || "";
  let products;
  if (search) {
    products = await sql`
      SELECT * FROM products WHERE is_active = true AND (name ILIKE ${"%" + search + "%"} OR description ILIKE ${"%" + search + "%"}) ORDER BY created_at DESC
    `;
  } else {
    products = await sql`SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC`;
  }

  const dummyImage = "/placeholder.jpg";
  const productsWithImages = products.map((product: any) => ({
    ...product,
    image_url: product.image_url || dummyImage,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <form method="GET" className="mb-8 flex gap-2 max-w-md mx-auto">
        <Input
          type="text"
          name="search"
          placeholder="Search products..."
          defaultValue={search}
        />
        <Button type="submit">Search</Button>
      </form>
      {productsWithImages.length === 0 ? (
        <div className="text-center text-muted-foreground">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsWithImages.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 