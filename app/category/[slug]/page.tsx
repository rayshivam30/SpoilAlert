import { sql } from "@/lib/db";
import CategoryClientPage from "./CategoryClientPage";

export default async function CategoryPage({ params }) {
  const { slug } = params;

  // Fetch category details
  const [category] = await sql`SELECT * FROM categories WHERE slug = ${slug}`;
  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found.</div>;
  }

  // Fetch products for this category
  const products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${category.id} AND is_active = true
    ORDER BY created_at DESC
  `;

  return <CategoryClientPage category={category} products={products} />;
} 